class Grass extends Entity {

    constructor() {
        super();
        this.rng = new RNG();
    }

    render() {
        super.render();

        this.rng.reset();
        
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            ctx.fillStyle = '#ab8';

            let x = 0;
            for (let i = 0 ; i < 15 ; i++) {
                ctx.wrap(() => {
                    ctx.translate(x, 0);
                    ctx.rotate(sin((this.age + this.rng.next(0, 5)) * TWO_PI / this.rng.next(4, 8)) * this.rng.next(PI / 16, PI / 4));
                    ctx.fillRect(-2, 0, 4, -this.rng.next(5, 20));
                });

                x += this.rng.next(5, 15);
            }
        });
    }
}
