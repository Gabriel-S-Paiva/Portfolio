---
title: "Project SAM — Municipal Support Platform"
date: "2025 — 2026"
role: "Dual-database REST API backend · team project"
awardBadge: "1st Place Award"
stack: ["Node.js", "Express", "MySQL", "MongoDB", "Socket.IO", "JWT"]
repoUrl: "https://github.com/Gabriel-S-Paiva/p2-sam-backend"
---
Backend REST API for a municipal management platform (Sistema de Apoio Municipal), handling domain operations, high-frequency logging, and real-time smart locker updates.

- Architected a dual-database schema using MySQL (Sequelize) for core domain entities and MongoDB (Mongoose) for logs and IoT telemetry.
- Implemented JWT token rotation with token family reuse-detection, permanent API key management, and rate limiting.
- Integrated Socket.IO for real-time notifications across municipal events and system alerts.