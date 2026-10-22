# Status producer

`status.py` runs on the home server (host, not in a container) and writes
`~/Portfolio/status/status.json`. That directory is bind-mounted read-only into
the portfolio container at `/usr/share/nginx/html/status`, and the hero panel
fetches `/status/status.json`.

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

## Rules

- Never mount `docker.sock` into any container. Only this script talks to Docker.
- Output is allowlist-only. Keep labels in `SERVICES` generic, and keep the
  container names in sync with `docker ps`.
- On Docker failure the script exits without writing; the site then shows
  "status unavailable" after 180 s. Do not add fallback data.
- The bind mount is the directory, not the file: `os.replace` changes the inode.

## Checks

- `systemctl --user list-timers portfolio-status.timer` shows the next run.
- Stop the timer: the panel shows "unavailable" within about 3 minutes.
- Remove the file: the panel shows "unavailable" on the next poll.
