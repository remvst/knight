class Camera extends Entity {
    constructor() {
        super();
        this.categories.push('camera');
        this.zoom = 1;
        this.affectedBySpeedRatio = false;

        this.minX = -evaluate(CANVAS_WIDTH / 2);
    }

    get appliedZoom() {
        // I'm a lazy butt and refuse to update the entire game to have a bit more zoom.
        // So instead I do dis ¯\_(ツ)_/¯
        return interpolate(1.2, 3, (this.zoom - 1) / 3);
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

        this.x = max(this.minX, this.x);
    }

    zoomTo(toValue) {
        if (this.previousInterpolator) {
            this.previousInterpolator.remove();
        }
        return this.scene.add(new Interpolator(this, 'zoom', this.zoom, toValue, 1)).await();
    }
}
