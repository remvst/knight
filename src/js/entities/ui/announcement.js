class Announcement extends Entity {
    constructor(text) {
        super();
        this.text = text;
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

        globalAlpha = this.age < 1 
            ? interpolate(0, 1, this.age)
            : interpolate(1, 0, this.age - 4);

        wrap(() => {
            translate(40, evaluate(CANVAS_HEIGHT - 40));

            fillStyle = '#fff';
            strokeStyle = '#000';
            lineWidth = 4;
            textAlign = nomangle('left');
            textBaseline = nomangle('alphabetic');
            font = nomangle('72pt Times New Roman');
            strokeText(this.text, 0, 0);
            fillText(this.text, 0, 0);
        });
    }
}
