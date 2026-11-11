# Status producer

`status.py` runs on the home server (host, not in a container) and writes
`~/Portfolio/status/status.json`. That directory is bind-mounted read-only into
the portfolio container at `/usr/share/nginx/html/status`, and the LAN build of
the hero panel fetches `/status/status.json`.

`push.sh` publishes the same file for the public GitHub Pages site: every
10 minutes it force-pushes a fresh single-commit `status` branch to the
Portfolio repo. The Pages build reads
`https://raw.githubusercontent.com/Gabriel-S-Paiva/Portfolio/status/status.json`
(`PUBLIC_STATUS_URL` in `.github/workflows/pages.yml`) and counts it stale
after 30 minutes (`PUBLIC_STATUS_STALE_S`), which is longer than the push
interval plus raw's ~5 minute cache. Anything pushed there is public, so the
allowlist rule below matters twice.

## Install (manual, one time; the runner's deploy does not do this)

The server is minimized Ubuntu without cron, so a systemd user timer runs the
script every minute. Linger keeps it running when nobody is logged in.

```sh
mkdir -p ~/bin ~/.config/systemd/user ~/Portfolio/status
cp ~/Portfolio/ops/status/status.py ~/bin/status.py   # re-copy after changes
cp ~/Portfolio/ops/status/portfolio-status.{service,timer} ~/.config/systemd/user/
loginctl enable-linger
systemctl --user daemon-reload
systemctl --user enable --now portfolio-status.timer
```

Create `~/Portfolio/status` yourself before the first `docker compose up`.
If Docker creates it, it is owned by root and the script cannot write to it
(fix: `rmdir` it, `mkdir` it, `docker restart portfolio-app`).

The user must be in the `docker` group (`groups` to check). Run the script once
by hand and read `~/Portfolio/status/status.json` before relying on the timer.

## Install the GitHub push (one time)

The push uses its own deploy key (write access to Portfolio only). The
`main` ruleset requires a PR with no bypass, so this key cannot touch `main`.

```sh
ssh-keygen -t ed25519 -N "" -C home-server-status -f ~/.ssh/portfolio_status
# add ~/.ssh/portfolio_status.pub as a deploy key with write access:
#   gh repo deploy-key add portfolio_status.pub -R Gabriel-S-Paiva/Portfolio -w -t home-server-status
cp ~/Portfolio/ops/status/push.sh ~/bin/status-push.sh   # re-copy after changes
cp ~/Portfolio/ops/status/portfolio-status-push.{service,timer} ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now portfolio-status-push.timer
```

`push.sh` ignores `~/.ssh/config` (it routes github.com through the Owned
Cloud key) and needs github.com in `~/.ssh/known_hosts`. Logs:
`journalctl --user -u portfolio-status-push`.

## Rules

- Never mount `docker.sock` into any container. Only this script talks to Docker.
- Output is allowlist-only. Keep labels in `SERVICES` generic, and keep the
  container names in sync with `docker ps`.
- On Docker failure the script exits without writing; the site then shows
  "status unavailable" after 180 s on the LAN, 30 min on Pages. Do not add
  fallback data.
- No workflow triggers on the `status` branch; keep it that way.
- The bind mount is the directory, not the file: `os.replace` changes the inode.

## Checks

- `systemctl --user list-timers portfolio-status.timer` shows the next run.
- Stop the timer: the panel shows "unavailable" within about 3 minutes.
- Remove the file: the panel shows "unavailable" on the next poll.
- `curl -sI https://raw.githubusercontent.com/Gabriel-S-Paiva/Portfolio/status/status.json`
  returns 200 with `access-control-allow-origin: *`.
- Stop `portfolio-status-push.timer`: the Pages panel shows "unavailable"
  after about 30 minutes.
