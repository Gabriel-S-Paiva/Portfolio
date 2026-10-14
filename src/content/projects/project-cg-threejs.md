---
title: "cg-threejs - 3D Virtual Pet"
date: "Dec 2025 - Jan 2026"
role: "Solo"
stack: ["Three.js", "Rapier", "Web Audio API", "Vite"]
repoUrl: "https://github.com/Gabriel-S-Paiva/cg-threejs"
commit: 'git commit -m "feat: cg-threejs"'
order: -2
featured: false
---
A Tamagotchi-style 3D pet for the Computer Graphics course. It hatches from an egg, runs on a small state machine (idle, eating, playing, sleeping), collapses into a physics ragdoll when the scene is shaken, and answers back through the microphone.

- Modelled the pet from code (lathe geometry from Bézier curves) and drew its face textures.
- Integrated Rapier physics: a capsule body for walking, and a ragdoll that inherits the pet's last measured velocity.
- Three camera modes, including first and third person with WASD movement.
