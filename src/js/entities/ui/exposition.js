class Exposition extends Entity {

    constructor(text) {
        super();
        this.text = text;
        this.alpha = 1;
    }

    get z() { 
        return LAYER_INSTRUCTIONS; 
    }

    doRender(camera) {
        if (!this.text) return;

        this.cancelCameraOffset(camera);

        translate(200, evaluate(CANVAS_HEIGHT / 2));

        textBaseline = nomangle('middle');
        textAlign = nomangle('left');
        fillStyle = '#fff';
        font = nomangle('18pt Times New Roman');

        let y = -this.text.length / 2 * 50;
        let lineIndex = 0;
        for (const line of this.text) {
            globalAlpha = between(0, (this.age - lineIndex * 3), 1) * this.alpha;
            fillText(line, 0, y);
            y += 50;
            lineIndex++;
        }
    }
}
