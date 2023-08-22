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

        ctx.fillStyle = '#000';
        ctx.fillRect(
            camera.x - CANVAS_WIDTH / 2, 
            camera.y - CANVAS_HEIGHT / 2, 
            CANVAS_WIDTH, 
            CANVAS_HEIGHT,
        );

        ctx.wrap(() => {
            for (const player of this.scene.category('player')) {
                player.doRender(camera);
            }
        });

        ctx.translate(camera.x, camera.y);
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);

        ctx.wrap(() => {
            ctx.translate(0, -CANVAS_HEIGHT / 2 + CANVAS_HEIGHT / 3);
            ctx.renderLargeText([
                [nomangle('P'), 192, -30],
                [nomangle('ATH'), 96, 30],
                [nomangle('TO'), 36, 20],
                [nomangle('G'), 192],
                [nomangle('LORY'), 96],
            ]);      
        })
    }
}
