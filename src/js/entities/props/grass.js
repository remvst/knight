class Grass extends Entity {

    constructor() {
        super();
        this.renderPadding = 100;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        regenEntity(this, CANVAS_WIDTH / 2 + 50);
    }

    doRender() {
        translate(this.x, this.y);
        
        withShadow(() => {
            this.rng.reset();

            let x = 0;
            for (let i = 0 ; i < 5 ; i++) {
                wrap(() => {
                    fillStyle = ctx.resolveColor('#ab8');
                    translate(x, 0);
                    rotate(sin((this.age + this.rng.next(0, 5)) * TWO_PI / this.rng.next(4, 8)) * this.rng.next(PI / 16, PI / 4));
                    fillRect(-2, 0, 4, -this.rng.next(5, 30));
                });

                x += this.rng.next(5, 15);
            }
        });
    }
}
