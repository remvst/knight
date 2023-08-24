class Rain extends Entity {
    get z() { 
        return LAYER_WEATHER;
    }

    doRender(camera) {
        this.rng.reset();

        ctx.fillStyle = '#0af';
        ctx.rotate(PI / 16);

        for (let i = 99 ; i-- ;) {
            const age = this.age + this.rng.next(0, 10);

            const leftX = camera.x - CANVAS_WIDTH / 2;
            const topY = camera.y - CANVAS_HEIGHT / 2;

            const x = this.rng.next(0, CANVAS_WIDTH);
            const y = this.rng.next(1000, 2000) * age;

            const shiftXCount = floor((x - leftX) / CANVAS_WIDTH);
            const shiftYCount = floor((y - topY) / CANVAS_HEIGHT);

            ctx.fillRect(
                x - shiftXCount * CANVAS_WIDTH,
                y - shiftYCount * CANVAS_HEIGHT,
                2,
                20,
            );
        }
    }
}
