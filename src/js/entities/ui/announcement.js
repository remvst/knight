class Announcement extends Entity {
    constructor(text) {
        super();
        this.text = text;
        this.affectedBySpeedRatio = false;
    }

    get z() { 
        return LAYER_LOGO; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 5) this.remove();
    }

    doRender(camera) {
        this.cancelCameraOffset(camera);

        ctx.globalAlpha = this.age < 1 
            ? interpolate(0, 1, this.age)
            : interpolate(1, 0, this.age - 4);

        ctx.wrap(() => {
            ctx.translate(40, evaluate(CANVAS_HEIGHT - 40));

            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;
            ctx.textAlign = nomangle('left');
            ctx.textBaseline = nomangle('alphabetic');
            ctx.font = nomangle('72pt Times New Roman');
            ctx.strokeText(this.text, 0, 0);
            ctx.fillText(this.text, 0, 0);
        });
    }
}
