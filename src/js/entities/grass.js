class Grass extends Entity {

    constructor() {
        super();
        this.rng = new RNG();
    }

    render() {
        super.render();

        ctx.translate(this.x, this.y);

        this.rng.reset();
        
        ctx.wrap(() => {

            let x = 0;
            for (let i = 0 ; i < 5 ; i++) {
                ctx.withShadow((color) => {
                    ctx.fillStyle = color('#ab8');
                    ctx.translate(x, 0);
                    ctx.rotate(sin((this.age + this.rng.next(0, 5)) * TWO_PI / this.rng.next(4, 8)) * this.rng.next(PI / 16, PI / 4));
                    ctx.fillRect(-2, 0, 4, -this.rng.next(5, 30));
                });

                x += this.rng.next(5, 15);
            }
        });
    }
}
