class Label extends Entity {
    constructor(text, color = '#fff') {
        super();
        this.text = text.toUpperCase();
        this.color = color;
    }

    get z() { 
        return LAYER_PLAYER_HUD; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 1 && !this.infinite) this.remove();
    }

    doRender() {
        ctx.translate(this.x, interpolate(this.y + 20, this.y, this.age / 0.25));
        if (!this.infinite) ctx.globalAlpha = interpolate(0, 1, this.age / 0.25);

        ctx.font = nomangle('bold 14pt Arial');
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.textAlign = nomangle('center');
        ctx.textBaseline = nomangle('middle');

        ctx.shadowColor = '#000';
        ctx.shadowOffsetX = ctx.shadowOffsetY = 1;

        ctx.strokeText(this.text, 0, 0);
        ctx.fillText(this.text, 0, 0);
    }
}
