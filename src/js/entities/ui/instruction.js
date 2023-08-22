class Instruction extends Entity {

    get z() { 
        return LAYER_INSTRUCTIONS; 
    }

    doRender(camera) {
        if (!this.text || GAME_PAUSED) return;

        this.cancelCameraOffset(camera);

        ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 5 / 6);
        ctx.renderInstruction(this.text);
    }
}
