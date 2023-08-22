class PauseOverlay extends Entity {
    get z() { 
        return LAYER_LOGO + 1; 
    }

    doRender(camera) {
        if (!GAME_PAUSED) return;

        this.cancelCameraOffset(camera);

        fillStyle = 'rgba(0,0,0,0.5)';
        fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        wrap(() => {
            translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);

            renderLargeText([
                [nomangle('G'), 192, 0],
                [nomangle('AME'), 96, 30],
                [nomangle('P'), 192, -30],
                [nomangle('AUSED'), 96],
            ]);
        });

        wrap(() => {
            translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 3 / 4);
            renderInstruction(nomangle('Press [P] or [ESC] to resume'));
        });

    }
}
