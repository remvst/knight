class Path extends Entity {

    get z() {
        return LAYER_PATH;
    }

    render() {
        super.render();

        // console.log('rend');

        const camera = firstItem(this.scene.category('camera'));

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
