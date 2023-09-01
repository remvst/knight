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

        ctx.wrap(() => {
            this.cancelCameraOffset(camera);
    
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            ctx.translate(evaluate(CANVAS_WIDTH / 2), evaluate(CANVAS_HEIGHT / 3));
            ctx.renderLargeText([
                [nomangle('P'), 192, -30],
                [nomangle('ATH'), 96, 30],
                [nomangle('TO'), 36, 20],
                [nomangle('G'), 192],
                [nomangle('LORY'), 96],
            ]);      
        });

        for (const player of this.scene.category('player')) {
            player.doRender(camera);
            if (BEATEN) ctx.renderCrown(player);
        }
    }
}
