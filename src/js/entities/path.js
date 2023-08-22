class Path extends Entity {

    get z() {
        return LAYER_PATH;
    }

    doRender(camera) {
        strokeStyle = '#dc9';
        lineWidth = 70;

        fillStyle = '#fff';

        beginPath();
        for (let x = roundToNearest(camera.x - CANVAS_WIDTH * 2, 300) ; x < camera.x + CANVAS_WIDTH ; x += 300) {
            const y = this.scene.pathCurve(x);
            lineTo(x, y);
        }
        stroke();
    }
}
