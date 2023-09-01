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

        ctx.translate(150, evaluate(CANVAS_HEIGHT / 2));

        ctx.textBaseline = nomangle('middle');
        ctx.textAlign = nomangle('left');
        ctx.fillStyle = '#fff';
        ctx.font = nomangle('24pt Times New Roman');

        let y = -this.text.length / 2 * 50;
        let lineIndex = 0;
        for (const line of this.text) {
            ctx.globalAlpha = between(0, (this.age - lineIndex * 3), 1) * this.alpha;
            ctx.fillText(line, 0, y);
            y += 75;
            lineIndex++;
        }
    }
}
