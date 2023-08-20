class Exposition extends Entity {

    constructor(text) {
        super();
        this.text = text;
        this.alpha = 1;
    }

    get z() { 
        return LAYER_INSTRUCTIONS; 
    }

    render() {
        if (!this.text) return;

        const camera = firstItem(this.scene.category('camera'));
        ctx.translate(camera.x, camera.y);
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);
        ctx.translate(-CANVAS_WIDTH / 2 + 200 , 0);

        ctx.textBaseline = nomangle('middle');
        ctx.textAlign = nomangle('left');
        ctx.fillStyle = '#fff';
        ctx.font = nomangle('18pt Times New Roman');

        let y = -this.text.length / 2 * 50;
        let lineIndex = 0;
        for (const line of this.text) {
            ctx.globalAlpha = between(0, (this.age - lineIndex * 3), 1) * this.alpha;
            ctx.fillText(line, 0, y);
            y += 50;
            lineIndex++;
        }
    }
}
