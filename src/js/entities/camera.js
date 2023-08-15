class Camera extends Entity {
    constructor() {
        super();
        this.categories.push('camera');
        this.zoom = 1;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        for (const player of this.scene.category('player')) {
            this.x += (player.x - this.x) * 0.05;
            this.y += (player.y - this.y) * 0.05;
        }
    }
}
