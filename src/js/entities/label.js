class Label extends Entity {
    constructor(text) {
        super();
        this.text = text.toUpperCase();
    }

    get z() { return Number.MAX_SAFE_INTEGER; }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 1) this.remove();
    }

    render() {
        super.render();

        ctx.translate(this.x, interpolate(this.y + 20, this.y, this.age / 0.25));
        ctx.globalAlpha = interpolate(0, 1, this.age / 0.25);

        ctx.font = nomangle('bold 14pt Arial');
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.textAlign = nomangle('center');
        ctx.textBaseline = nomangle('middle');

        ctx.wrap(() => {
            ctx.shadowColor = '#000';
            ctx.shadowOffsetY = 3;
            ctx.fillText(this.text, 0, 0);
        });
        // ctx.fillText(this.text, 0, 0);
        // ctx.strokeText(this.text, 0, 0);
    }
}
