    update() {
        const now = performance.now() / 1000;
        const dt = now - this.lastTime;
        this.lastTime = now;
        this.stateTime += dt;
        
        const worldPos = new THREE.Vector3();
        this.getWorldPosition(worldPos);
        if (this.previousWorldPos) {
            const timeStep = Math.max(dt, 0.001);
            this.currentWorldVelocity = worldPos.clone().sub(this.previousWorldPos).divideScalar(timeStep);
        } else {
            this.currentWorldVelocity = new THREE.Vector3(0, 0, 0);
        }
        this.previousWorldPos = worldPos;

        if (this.isRagdoll) {
            this.updateRagdoll();
            return;
        }
