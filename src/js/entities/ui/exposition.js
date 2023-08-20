class Exposition extends Entity {

    constructor(text) {
        super();
        this.text = text;
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

        ctx.textBaseline = nomangle('alphabetic');
        ctx.textAlign = nomangle('left');
        ctx.fillStyle = '#fff';
        ctx.font = nomangle('24pt Times New Roman');

        let y = CANVAS_HEIGHT / 2 - this.text.length * 100;
        let lineIndex = 0;
        for (const line of this.text) {
            const alpha = between(0, (this.age - lineIndex * 3), 1);
            ctx.globalAlpha = alpha;
            ctx.fillText(line, 0, y);
            y += 100;
            lineIndex++;
        }
    }
}
