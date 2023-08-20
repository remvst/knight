class Rain extends Entity {
    get z() { 
        return LAYER_WEATHER;
    }

    render() {
        super.render();

        const camera = firstItem(this.scene.category('camera'));

        this.rng.reset();
        for (let i = 40 ; i-- ;) {
            const age = this.age + this.rng.next(0, 10);
            const duration = this.rng.next(0.5, 1);
            const relAge = age / duration % duration;

            ctx.wrap(() => {
                ctx.rotate(this.rng.next(0, PI / 16));
                ctx.translate(camera.x - CANVAS_WIDTH / 2, camera.y - CANVAS_HEIGHT / 2);

                ctx.fillStyle = '#0af';
                ctx.fillRect(
                    this.rng.next(0, CANVAS_WIDTH),
                    relAge * CANVAS_HEIGHT,
                    2,
                    20,
                );
            });
        }
    }
}
