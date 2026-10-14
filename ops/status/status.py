#!/usr/bin/env python3
"""Write the public status file for the portfolio hero panel.

Runs on the host (cron), never inside a container. Allowlist-only output:
no container IDs, ports, IPs, env vars, image names or logs.
If Docker fails the script exits without writing, so the file goes stale and
the site says so. It never writes fake or default data.
"""
import json, os, subprocess, tempfile, time

OUT = os.path.expanduser("~/Portfolio/status/status.json")
SERVICES = {  # container name -> label shown on the site
    "portfolio-app": "portfolio",
    "gateway-caddy": "gateway",
    "cloud-web": "cloud · proxy",
    # TODO: add the Cloud Go backend container once its name is confirmed.
}


def services():
    out = subprocess.run(
        ["docker", "ps", "-a", "--format", "{{.Names}}|{{.State}}|{{.Status}}"],
        capture_output=True, text=True, timeout=10, check=True).stdout
    found = {}
    for line in out.splitlines():
        name, state, status = line.split("|", 2)
        found[name] = (state, status)
    result = []
    for name, label in SERVICES.items():
        state, status = found.get(name, ("missing", ""))
        up = state == "running"
        result.append({
            "name": label,
            "state": "up" if up else "down",
            "uptime": status.removeprefix("Up ").split(" (")[0] if up else None,
        })
    return result


def host():
    load1 = float(open("/proc/loadavg").read().split()[0])
    mem = {l.split(":")[0]: int(l.split()[1]) for l in open("/proc/meminfo")}
    used = 100 - round(100 * mem["MemAvailable"] / mem["MemTotal"])
    up = int(float(open("/proc/uptime").read().split()[0]))
    return {"load1": load1, "mem_used_pct": used, "uptime_s": up}


def main():
    payload = {"generatedAt": int(time.time()), "host": host(), "services": services()}
    d = os.path.dirname(OUT)
    os.makedirs(d, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=d, suffix=".tmp")
    with os.fdopen(fd, "w") as f:
        json.dump(payload, f)
    os.chmod(tmp, 0o644)  # mkstemp makes it 0600; nginx in the container must be able to read it
    os.replace(tmp, OUT)


main()
