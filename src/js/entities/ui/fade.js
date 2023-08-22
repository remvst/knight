class Fade extends Entity {
    constructor() {
        super();
        this.alpha = 1;
    }

    get z() { 
        return LAYER_FADE;
    }

    doRender(camera) {
        this.cancelCameraOffset(camera);

        ctx.fillStyle = '#000';
        ctx.globalAlpha = this.alpha;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}
