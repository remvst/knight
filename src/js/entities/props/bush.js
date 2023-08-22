class Bush extends Entity {

    constructor() {
        super();
        this.renderPadding = 100;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        regenEntity(this, CANVAS_WIDTH / 2 + 50, CANVAS_HEIGHT / 2 + 50);
    }

    doRender() {
        ctx.translate(this.x, this.y);
        
        ctx.withShadow(() => {
            this.rng.reset();

            let x = 0;
            for (let i = 0 ; i < 5 ; i++) {
                ctx.wrap(() => {
                    ctx.fillStyle = ctx.resolveColor('green');
                    ctx.translate(x, 0);
                    ctx.rotate(sin((this.age + this.rng.next(0, 5)) * TWO_PI / this.rng.next(4, 8)) * this.rng.next(PI / 32, PI / 16));
                    ctx.fillRect(-10, 0, 20, -this.rng.next(20, 60));
                });

                x += this.rng.next(5, 15);
            }
        });
    }
}
