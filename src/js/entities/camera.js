class Camera extends Entity {
    constructor() {
        super();
        this.categories.push('camera');
        this.zoom = 1;
        this.affectedBySpeedRatio = false;
    }

    get appliedZoom() {
        // I'm a lazy butt and refuse to update the entire game to have a bit more zoom.
        // So instead I do dis ¯\_(ツ)_/¯
        return max(1.2, this.zoom);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        for (const player of this.scene.category('player')) {
            const target = {'x': player.x, 'y': player.y - 60 };
            const distance = dist(this, target);
            const angle = angleBetween(this, target);
            const appliedDist = min(distance, distance * elapsed * 3);
            this.x += appliedDist * cos(angle);
            this.y += appliedDist * sin(angle);
        }
    }
}
