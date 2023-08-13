class Tree extends Entity {

    constructor() {
        super();
        this.rng = new RNG();
    }

    render() {
        super.render();

        ctx.translate(this.x, this.y);
        
        ctx.withShadow((color) => {

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

                    ctx.fillStyle = color('green');
                    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
                });
            }
        });
        
        // ctx.wrap(() => {
        //     ctx.translate(this.x, this.y);
        //     ctx.scale(1, 0.5);
        //     ctx.transform(1, 0, 0.15, 1, 0, 0); // shear the context

        //     ctx.fillStyle = '#000';

        //     this.rng.reset();

        //     const trunkWidth = this.rng.next(10, 20);
        //     const trunkHeight = this.rng.next(100, 250);

        //     ctx.fillRect(-trunkWidth / 2, 0, trunkWidth, -trunkHeight);
        // });
    }
}
