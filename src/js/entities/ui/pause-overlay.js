class PauseOverlay extends Entity {
    get z() { 
        return LAYER_LOGO + 1; 
    }

    doRender(camera) {
        if (!GAME_PAUSED) return;

        ctx.translate(camera.x, camera.y);
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);
        ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);

            ctx.renderLargeText([
                [nomangle('G'), 192, 0],
                [nomangle('AME'), 96, 30],
                [nomangle('P'), 192, -30],
                [nomangle('AUSED'), 96],
            ]);
        });

        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 3 / 4);
            ctx.renderInstruction(nomangle('Press [P] or [ESC] to resume'));
        });

    }
}
