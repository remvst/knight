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

        fillStyle = '#000';
        globalAlpha = this.alpha;
        fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}
