class Tree extends Entity {

    constructor() {
        super();

        this.trunkWidth = rnd(10, 20);
        this.trunkHeight = rnd(100, 250);

        this.bushes = [{
            x: 0,
            y: 0,
            radius: rnd(20, 40),
        }];

        let x = 0;
        for (let i = 0 ; i < 3 ; i++) {
            const angle = random() * TWO_PI;
            const dist = rnd(20, 50);
            this.bushes.push({
                x: cos(angle) * dist,
                y: sin(angle) * dist * 0.5,
                radius: rnd(20, 60),
                offset: random() * 10,
                period: rnd(4, 8),
            });
        }
    }

    render() {
        super.render();
        
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            ctx.fillStyle = '#634';
            ctx.fillRect(-this.trunkWidth / 2, 0, this.trunkWidth, -this.trunkHeight);

            ctx.translate(0, -this.trunkHeight);

            for (const { x, y, radius, offset, period } of this.bushes) {
                ctx.wrap(() => {
                    ctx.translate(x, y);
                    ctx.rotate(PI / 4);

                    ctx.rotate(sin((this.age + offset) * TWO_PI / period) * PI / 32);

                    ctx.fillStyle = 'green';
                    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
                });
            }
        });
    }
}
