class Player extends Entity {
    constructor() {
        super();
        this.categories.push('player');

        this.facing = 1;

        this.controls = {
            'force': 0,
            'angle': 0,
        };
    }

    render() {
        super.render();

        ctx.wrap(() => {
            ctx.translate(this.x, this.y);
            ctx.scale(this.facing, 1);

            ctx.fillStyle = '#fff';

            // Left leg
            ctx.wrap(() => {
                ctx.fillStyle = '#888';
                ctx.translate(-6, 15);
                if (this.controls.force) ctx.rotate(-sin(this.age * TWO_PI * 4) * PI / 16);
                ctx.fillRect(-4, 0, 8, 20);
            });

            // Right leg
            ctx.wrap(() => {
                ctx.fillStyle = '#888';
                ctx.translate(6, 15);
                if (this.controls.force) ctx.rotate(sin(this.age * TWO_PI * 4) * PI / 16);
                ctx.fillRect(-4, 0, 8, 20);
            });

            // Head
            ctx.wrap(() => {
                ctx.fillStyle = '#fec';
                ctx.translate(0, -22);
                if (this.controls.force) ctx.rotate(-sin(this.age * TWO_PI * 4) * PI / 32);
                ctx.fillRect(-7, -7, 15, 15);
            });
            
            // Chest
            ctx.wrap(() => {
                ctx.fillStyle = '#ccc';
                if (this.controls.force) ctx.rotate(-sin(this.age * TWO_PI * 4) * PI / 64);
                ctx.fillRect(-12, -15, 25, 30);
            });

            // Arm
            ctx.wrap(() => {
                ctx.fillStyle = '#888';
                ctx.translate(15, -10);
                if (this.controls.force) ctx.rotate(-sin(this.age * TWO_PI * 4) * PI / 32);
                ctx.fillRect(-3, 0, 20, 6);

                // Sword
                ctx.wrap(() => {
                    ctx.translate(15, -3);

                    ctx.fillStyle = '#444';
                    ctx.fillRect(-10, -2, 20, 4);
                    ctx.fillRect(-3, 0, 6, 12);

                    ctx.fillStyle = '#eee';
                    ctx.beginPath();
                    ctx.moveTo(-3, 0);
                    ctx.lineTo(-5, -35);
                    ctx.lineTo(0, -40);
                    ctx.lineTo(5, -35);
                    ctx.lineTo(3, 0);
                    ctx.fill();
                });
            });
        });
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        let x = 0, y = 0;
        if (DOWN[37]) x = -1;
        if (DOWN[38]) y = -1;
        if (DOWN[39]) x = 1;
        if (DOWN[40]) y = 1;

        this.controls.angle = atan2(y, x);
        this.controls.force = x || y ? 1 : 0;
        
        this.x += cos(this.controls.angle) * this.controls.force * 200 * elapsed;
        this.y += sin(this.controls.angle) * this.controls.force * 200 * elapsed;

        if (x) this.facing = x;
    }
}
