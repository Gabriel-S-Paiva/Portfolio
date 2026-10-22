        const data = new Float32Array(this.analyser.fftSize);
        const check = () => {
            if (!this.micEnabled) return;
            this.analyser.getFloatTimeDomainData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
            const rms = Math.sqrt(sum / data.length);
            const now = performance.now();
            if (rms > this.micThreshold && (now - this._lastTrigger) > this.minTriggerInterval) {
                this._lastTrigger = now;
                this._startShortRecording();
            }
            requestAnimationFrame(check);
        };
        this.micEnabled = true;
        check();
    }
