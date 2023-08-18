class Camera extends Entity {
    constructor() {
        super();
        this.categories.push('camera');
        this.zoom = 1;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        for (const player of this.scene.category('player')) {
            const distance = dist(this, player);
            const angle = angleBetween(this, player);
            const speed = distance * 3;
            this.x += speed * elapsed * cos(angle);
            this.y += speed * elapsed * sin(angle);
        }
    }
}
