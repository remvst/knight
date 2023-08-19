renderLogo = (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 0, -150);
    grad.addColorStop(0, '#888');
    grad.addColorStop(0.7, '#eee');
    grad.addColorStop(1, '#888');

    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;

    let x = 0;
    for (const [text, size, offsetWidth] of [
        [nomangle('P'), 192, -30],
        [nomangle('ATH'), 96, 30],
        [nomangle('TO'), 36, 20],
        [nomangle('G'), 192],
        [nomangle('LORY'), 96],
    ]) {
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 5;
        ctx.font = size + nomangle('px Times New Roman');

        ctx.strokeText(text, x, 0);

        ctx.shadowBlur = 0;
        ctx.fillText(text, x, 0);

        x += ctx.measureText(text).width + (offsetWidth || 0);
    }

    return x;
}

logo = createCanvas(1, 180, (ctx, can) => {
    can.width = renderLogo(ctx) + 10 * 2;

    ctx.translate(10, 170);
    renderLogo(ctx);
});

class Logo extends Entity {
    constructor() {
        super();
        this.alpha = 1;
    }

    get z() { return Number.MAX_SAFE_INTEGER; }

    render() {
        ctx.globalAlpha = this.alpha;

        const camera = firstItem(this.scene.category('camera'));
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);

        ctx.translate(this.x, this.y);
        ctx.drawImage(logo, -logo.width / 2, -logo.height);
    }
}
