class Instruction extends Entity {

    get z() { 
        return LAYER_INSTRUCTIONS; 
    }

    doRender(camera) {
        if (!this.text) return;

        ctx.translate(camera.x, camera.y);
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);
        ctx.translate(0, CANVAS_HEIGHT / 4);

        ctx.textBaseline = nomangle('middle');
        ctx.textAlign = nomangle('center');
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.font = nomangle('18pt Times New Roman');

        const width = ctx.measureText(this.text).width + 20;
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.fillRect(-width / 2, 0, width, 40);

        ctx.fillStyle = '#fff';
        ctx.strokeText(this.text, 0, 20);
        ctx.fillText(this.text, 0, 20);
    }
}
