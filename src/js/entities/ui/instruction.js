class Instruction extends Entity {

    get z() { 
        return LAYER_INSTRUCTIONS; 
    }

    doRender(camera) {
        if (!this.text || GAME_PAUSED) return;

        this.cancelCameraOffset(camera);

        translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 5 / 6);

        textBaseline = nomangle('middle');
        textAlign = nomangle('center');
        strokeStyle = '#000';
        lineWidth = 4;
        font = nomangle('18pt Times New Roman');

        renderInstruction(this.text);
    }
}
