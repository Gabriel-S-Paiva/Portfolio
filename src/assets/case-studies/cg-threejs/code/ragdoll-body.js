        const tBody = getMeshTransform(this.body);
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(tBody.pos.x, tBody.pos.y, tBody.pos.z)
            .setRotation(tBody.quat)
            .setLinearDamping(0)
            .setAngularDamping(0)
            .setCcdEnabled(true);
        
        if (this.currentWorldVelocity) {
            bodyDesc.setLinvel(
                this.currentWorldVelocity.x, 
                this.currentWorldVelocity.y, 
                this.currentWorldVelocity.z
            );
        }

        this.bodyRigidBody = this.physicsWorld.createRigidBody(bodyDesc);
        
        const bodyCollider = RAPIER.ColliderDesc.capsule(2 * scale, 2.0 * scale)
            .setTranslation(0, 3* scale, 0)
            .setRestitution(0.9)
            .setFriction(0.2)
            .setDensity(1.5);
        this.physicsWorld.createCollider(bodyCollider, this.bodyRigidBody);
        this.rigidBodies.push(this.bodyRigidBody);
