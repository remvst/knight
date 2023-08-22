class Label extends Entity {
    constructor(text) {
        super();
        this.text = text.toUpperCase();
    }

    get z() { 
        return LAYER_PLAYER_HUD; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 1 && !this.infinite) this.remove();
    }

    doRender() {
        translate(this.x, interpolate(this.y + 20, this.y, this.age / 0.25));
        if (!this.infinite) globalAlpha = interpolate(0, 1, this.age / 0.25);

        font = nomangle('bold 14pt Arial');
        fillStyle = '#fff';
        strokeStyle = '#000';
        lineWidth = 2;
        textAlign = nomangle('center');
        textBaseline = nomangle('middle');

        shadowColor = '#000';
        shadowOffsetX = shadowOffsetY = 1;

        strokeText(this.text, 0, 0);
        fillText(this.text, 0, 0);
    }
}
