class Instruction extends Entity {

    get z() { 
        return LAYER_INSTRUCTIONS; 
    }

    doRender(camera) {
        if (!this.text || GAME_PAUSED) return;

        this.cancelCameraOffset(camera);

        ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 5 / 6);

        ctx.textBaseline = nomangle('middle');
        ctx.textAlign = nomangle('center');
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.font = nomangle('18pt Times New Roman');

        ctx.renderInstruction(this.text);
    }
}
