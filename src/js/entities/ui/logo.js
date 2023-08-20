LOGO_GRADIENT = createCanvas(1, 1, (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 0, -150);
    grad.addColorStop(0, '#888');
    grad.addColorStop(0.7, '#eee');
    grad.addColorStop(1, '#888');
    return grad;
});

class Logo extends Entity {
    constructor() {
        super();
        this.alpha = 1;
    }

    get z() { 
        return LAYER_LOGO; 
    }

    doRender(camera) {
        if (GAME_PAUSED) return;

        ctx.globalAlpha = this.alpha;
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);
        ctx.translate(this.x, this.y);

        ctx.renderLargeText([
            [nomangle('P'), 192, -30],
            [nomangle('ATH'), 96, 30],
            [nomangle('TO'), 36, 20],
            [nomangle('G'), 192],
            [nomangle('LORY'), 96],
        ]);
    }
}
