class Bush extends Entity {

    constructor() {
        super();
        this.rng = new RNG();
    }

    render() {
        super.render();

        ctx.translate(this.x, this.y);
        
        ctx.withShadow((color) => {

            this.rng.reset();

            for (let i = 0 ; i < 3 ; i++) {
                const angle = i / 3 * TWO_PI;
                const dist = this.rng.next(10, 20);
                const x =  cos(angle) * dist;
                const y = sin(angle) * dist * 0.5;
                const radius = this.rng.next(30, 60);

                ctx.wrap(() => {
                    ctx.translate(x, y);

                    ctx.rotate(sin((this.age + this.rng.next(0, 10)) * TWO_PI / this.rng.next(2, 8)) * PI / 64);

                    ctx.fillStyle = color('green');
                    ctx.beginPath();
                    ctx.moveTo(0, -radius)
                    ctx.lineTo(radius, 0);
                    ctx.lineTo(-radius, 0);
                    ctx.fill();
                });
            }
        });
    }
}
