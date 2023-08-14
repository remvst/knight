class Tree extends Obstacle {

    constructor() {
        super();
        this.rng = new RNG();

        this.radius = 20;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        regenEntity(this, CANVAS_WIDTH / 2 + 200);
    }

    render() {
        super.render();

        ctx.translate(this.x, this.y);
        
        ctx.withShadow((color) => {
            ctx.rotate(sin((this.age + this.rng.next(0, 10)) * TWO_PI / this.rng.next(4, 16)) * this.rng.next(PI / 32, PI / 64));

            ctx.fillStyle = color('#a65');

            this.rng.reset();

            const trunkWidth = this.rng.next(10, 20);
            const trunkHeight = this.rng.next(100, 250);

            ctx.fillRect(-trunkWidth / 2, 0, trunkWidth, -trunkHeight);

            ctx.translate(0, -trunkHeight);

            for (let i = 0 ; i < 5 ; i++) {
                const angle = i / 5 * TWO_PI;
                const dist = this.rng.next(20, 50);
                const x =  cos(angle) * dist;
                const y = sin(angle) * dist * 0.5;
                const radius = this.rng.next(20, 40);

                ctx.wrap(() => {
                    ctx.translate(x, y);
                    ctx.rotate(PI / 4);

                    ctx.rotate(sin((this.age + this.rng.next(0, 10)) * TWO_PI / this.rng.next(2, 8)) * PI / 32);

                    ctx.fillStyle = color('#060');
                    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
                });
            }
        });
    }
}
