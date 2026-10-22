const camera = {
  x: 0,
  y: 0,
  deadZoneX: W * 0.3, // Player can move 30% from center before camera moves
  deadZoneWidth: W * 0.4, // Dead zone is 40% of screen width
  smoothness: 0.1, // Camera lerp factor (lower = smoother)
  worldWidth: 2016, // Total world width (matches right boundary)
  worldHeight: H,

  update(targetX) {
    // Calculate camera bounds
    const leftBound = this.x + this.deadZoneX;
    const rightBound = this.x + this.deadZoneX + this.deadZoneWidth;

    // Only move camera if player exits dead zone
    if (targetX < leftBound) {
      this.x += (targetX - leftBound) * this.smoothness;
    } else if (targetX > rightBound) {
      this.x += (targetX - rightBound) * this.smoothness;
    }

    // Clamp camera to world bounds
    this.x = Math.max(0, Math.min(this.worldWidth - W, this.x));
    this.y = Math.max(0, Math.min(this.worldHeight - H, this.y));
  },

  apply(ctx) {
    ctx.translate(-Math.round(this.x), -Math.round(this.y));
  },
};
