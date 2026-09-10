---
title: "Owned Cloud"
date: "In progress · target v1.0.0"
role: "Self-hosted family cloud storage platform · solo project"
stack: ["Go", "SQLite", "SvelteKit 5", "Docker", "Caddy", "GitHub Actions"]
repoUrl: "https://github.com/Gabriel-S-Paiva/Cloud"
---
A self-hosted Dropbox-style file cloud with role-based auth, storage quota enforcement, and granular folder sharing options.

- Designed a single-origin Caddy reverse-proxy setup enabling secure HttpOnly cookie session auth over LAN HTTP.
- Engineered a two-phase chunked upload pipeline with transactional quota reservations.
- Configured GitHub Actions CI/CD with automated vulnerability scanning (govulncheck, pnpm audit) and Dependabot updates.
- Achieved 67% test coverage on the storage layer via `go test`. Currently self-hosted on home server hardware.