class Fade extends Entity {
    constructor() {
        super();
        this.alpha = 1;
    }

    get z() { 
        return LAYER_FADE;
    }

    render() {
        super.render();
        const camera = firstItem(this.scene.category('camera'));
        ctx.fillStyle = '#000';
        ctx.globalAlpha = this.alpha;
        ctx.fillRect(camera.x - CANVAS_WIDTH / 2, camera.y - CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}
