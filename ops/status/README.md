# Status producer

`status.py` runs on the home server (host, not in a container) and writes
`~/Portfolio/status/status.json`. That directory is bind-mounted read-only into
the portfolio container at `/usr/share/nginx/html/status`, and the hero panel
fetches `/status/status.json`.

## Install (manual, one time; the runner's deploy does not do this)

```sh
mkdir -p ~/bin
cp ~/Portfolio/ops/status/status.py ~/bin/status.py   # re-copy after changes
crontab -e
# add:
* * * * * /usr/bin/python3 $HOME/bin/status.py
```

The cron user must be in the `docker` group (`groups` to check). Run it once by
hand and read `~/Portfolio/status/status.json` before relying on cron.

## Rules

- Never mount `docker.sock` into any container. Only this script talks to Docker.
- Output is allowlist-only. Keep labels in `SERVICES` generic.
- On Docker failure the script exits without writing; the site then shows
  "status unavailable" after 180 s. Do not add fallback data.
- The bind mount is the directory, not the file: `os.replace` changes the inode.

## Checks

- Stop cron: the panel shows "unavailable" within about 3 minutes.
- `docker stop cloud-web`: that row shows down within about a minute.
