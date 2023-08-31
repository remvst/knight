class Instruction extends Entity {

    get z() { 
        return LAYER_INSTRUCTIONS; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.text != this.previousText) {
            this.previousText = this.text;
            this.textAge = 0; 
        }
        this.textAge += elapsed;
    }

    doRender(camera) {
        if (!this.text || GAME_PAUSED) return;

        this.cancelCameraOffset(camera);

        ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 5 / 6);

        ctx.scale(
            interpolate(1.2, 1, this.textAge * 8),
            interpolate(1.2, 1, this.textAge * 8),
        );
        ctx.renderInstruction(this.text);
    }
}
