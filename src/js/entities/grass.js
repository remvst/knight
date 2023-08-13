class Grass extends Entity {

    constructor() {
        super();

        this.blades = [];

        let x = 0;
        for (let i = 0 ; i < 15 ; i++) {
            this.blades.push({
                x,
                'length': rnd(5, 20),
                'offset': rnd(0, 5),
                'period': rnd(4, 8),
                'amplitude': rnd(PI / 16, PI / 4),
            });
            x += rnd(5, 15);
        }
    }

    render() {
        super.render();
        
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            ctx.fillStyle = '#ab8';

            for (const { x, length, offset, period, amplitude } of this.blades) {
                ctx.wrap(() => {
                    ctx.translate(x, 0);
                    ctx.rotate(sin((this.age + offset) * TWO_PI / period) * amplitude);
                    ctx.fillRect(-2, 0, 4, -length);
                });
            }
        });
    }
}
