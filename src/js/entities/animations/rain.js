class Rain extends Entity {
    get z() { 
        return LAYER_WEATHER;
    }

    doRender(camera) {
        this.rng.reset();

        ctx.fillStyle = '#0af';

        this.cancelCameraOffset(camera);

        for (let i = 99 ; i-- ;) {
            ctx.wrap(() => {
                ctx.translate(evaluate(CANVAS_WIDTH / 2), evaluate(CANVAS_HEIGHT / 2));
                ctx.rotate(this.rng.next(0, PI / 16));
                ctx.translate(-evaluate(CANVAS_WIDTH / 2), -evaluate(CANVAS_HEIGHT / 2));

                ctx.fillRect(
                    this.rng.next(0, CANVAS_WIDTH),
                    this.rng.next(1000, 2000) * (this.age + this.rng.next(0, 10)) % CANVAS_HEIGHT,
                    2,
                    20,
                );
            });
        }
    }
}
