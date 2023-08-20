class Path extends Entity {

    get z() {
        return LAYER_PATH;
    }

    doRender(camera) {
        ctx.strokeStyle = '#dc9';
        ctx.lineWidth = 70;

        ctx.fillStyle = '#fff';

        ctx.beginPath();
        for (let x = roundToNearest(camera.x - CANVAS_WIDTH * 2, 300) ; x < camera.x + CANVAS_WIDTH ; x += 300) {
            const y = this.scene.pathCurve(x);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}
