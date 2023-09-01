class Entity {
    constructor() {
        this.x = this.y = this.rotation = this.age = 0;   
        this.categories = [];

        this.rng = new RNG();

        this.renderPadding = Infinity;

        this.affectedBySpeedRatio = true;
    }

    get z() { 
        return this.y; 
    }

    get inWater() {
        if (this.scene)
        for (const water of this.scene.category('water')) {
            if (water.contains(this)) return true;
        }
    }

    cycle(elapsed) {
        this.age += elapsed;
    }

    render() {
        const camera = firstItem(this.scene.category('camera'));
        if (
            isBetween(camera.x - CANVAS_WIDTH / 2 - this.renderPadding, this.x, camera.x + CANVAS_WIDTH / 2 + this.renderPadding) &&
            isBetween(camera.y - CANVAS_HEIGHT / 2 - this.renderPadding, this.y, camera.y + CANVAS_HEIGHT / 2 + this.renderPadding)
        ) {
            this.rng.reset();
            this.doRender(camera);
        }
    }

    doRender(camera) {

    }

    remove() {
        this.scene.remove(this);
    }

    cancelCameraOffset(camera) {
        ctx.translate(camera.x, camera.y);
        ctx.scale(1 / camera.appliedZoom, 1 / camera.appliedZoom);
        ctx.translate(evaluate(-CANVAS_WIDTH / 2), evaluate(-CANVAS_HEIGHT / 2));
    }
}
