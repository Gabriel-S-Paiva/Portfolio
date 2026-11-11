#!/bin/sh
# Publish the current status.json to the public, data-only repo
# Gabriel-S-Paiva/portfolio-status (Actions disabled), where the GitHub Pages
# build reads it via raw.githubusercontent.com. Each run force-pushes a fresh
# single-commit main, so history never grows. The deploy key is scoped to that
# repo only: it has no access to Portfolio, its runner or its secrets.
# Ignores ~/.ssh/config (which routes github.com through the Owned Cloud key).
# Never writes fallback data: no file, no push.
set -eu

SRC="$HOME/Portfolio/status/status.json"
KEY="$HOME/.ssh/portfolio_status"
REMOTE="git@github.com:Gabriel-S-Paiva/portfolio-status.git"

[ -s "$SRC" ] || { echo "push.sh: $SRC missing or empty" >&2; exit 1; }

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
cp "$SRC" "$tmp/status.json"

cd "$tmp"
git init -q -b main
git add status.json
git -c user.name="status-bot" -c user.email="status-bot@localhost" \
  commit -q -m "status $(date -u +%Y-%m-%dT%H:%MZ)"
GIT_SSH_COMMAND="ssh -F /dev/null -i $KEY -o IdentitiesOnly=yes -o UserKnownHostsFile=$HOME/.ssh/known_hosts -o BatchMode=yes" \
  git push -q -f "$REMOTE" HEAD:refs/heads/main
