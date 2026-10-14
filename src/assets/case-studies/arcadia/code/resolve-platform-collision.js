    resolvePlatformCollision(platform, dt) {
        const hb = this.getHitbox();
        const p = platform.getAABB ? platform.getAABB() : {
            x: platform.x,
            y: platform.y,
            w: platform.w,
            h: platform.h
        };
        
        // Verifica se há colisão
        if (!(hb.x < p.x + p.w && hb.x + hb.w > p.x &&
              hb.y < p.y + p.h && hb.y + hb.h > p.y)) return;

        // Para plataformas semi-sólidas
        if (platform.isOneWay && platform.isOneWay()) {
            const prevBottom = this.prevPos.y + this.height / 2;
            const platformVel = platform.vy || 0;
            const relativeVelY = this.vel.y - platformVel;
            
            // Permite pousar se:
            // 1. Jogador estava acima da plataforma no frame anterior
            // 2. Jogador está se movendo para baixo em relação à plataforma
            const tolerance = 10;
            if (prevBottom > p.y + tolerance) return;  // Garente Colisão Normal caso jogador estja acime deixa atravessar caso abaixo
            if (relativeVelY < -10) return;  // Garente que o jogador continua o salto sem ficar colado a platforma
        }

        // Calcula sobreposições
        const oR = p.x + p.w - hb.x;
        const oL = hb.x + hb.w - p.x;
        const oB = p.y + p.h - hb.y;
        const oT = hb.y + hb.h - p.y;
        const oX = Math.min(oL, oR);
        const oY = Math.min(oT, oB);

        if (oX < oY) {
            // Colisão horizontal
            this.pos.x = oL < oR ? p.x - this.width / 2 : p.x + p.w + this.width / 2;
            this.vel.x = 0;
            if (platform.vx) this.pos.x += platform.vx * dt;
        } else {
            // Colisão vertical
            if (oT < oB) {
                // Pousar na plataforma
                this.pos.y = p.y - this.height / 2;
                this.onGround = true;
                this.standingOnPlatform = platform;
                this.onMovingPlatform = platform;
                
                // Herda velocidade da plataforma
                if (platform.vy !== undefined && platform.vy !== 0) {
                    this.vel.y = platform.vy;
                } else {
                    this.vel.y = 0;
                }
                
                // Aplica movimento horizontal da plataforma
                if (platform.vx) {
                    this.pos.x += platform.vx * dt;
                }
            } else {
                // Bater a cabeça na plataforma
                this.pos.y = p.y + p.h + this.height / 2;
                this.vel.y = Math.max(0, platform.vy || 0);
            }
        }
    }
