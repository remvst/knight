class Player extends Entity {
    constructor() {
        super();
        this.categories.push('player');

        this.facing = 1;

        this.controls = {
            'force': 0,
            'angle': 0,
            'shield': false,
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
            
            // Chest
            ctx.wrap(() => {
                ctx.fillStyle = '#ccc';
                if (this.controls.force) ctx.rotate(-sin(this.age * TWO_PI * 4) * PI / 64);
                ctx.fillRect(-12, -15, 25, 30);
            });

            // Sword arm
            ctx.wrap(() => {
                ctx.fillStyle = '#888';
                ctx.translate(12, -10);
                if (this.controls.force) ctx.rotate(-sin(this.age * TWO_PI * 4) * PI / 32);
                if (this.controls.shield) ctx.rotate(-PI / 2);
                ctx.fillRect(0, -3, 20, 6);

                // Sword
                ctx.wrap(() => {
                    ctx.translate(18, -6);

                    ctx.fillStyle = '#444';
                    ctx.fillRect(-10, -2, 20, 4);
                    ctx.fillRect(-3, 0, 6, 12);

                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.moveTo(-3, 0);
                    ctx.lineTo(-5, -35);
                    ctx.lineTo(0, -40);
                    ctx.lineTo(5, -35);
                    ctx.lineTo(3, 0);
                    ctx.fill();
                });
            });

            // Head
            ctx.wrap(() => {
                ctx.fillStyle = '#fec';
                ctx.translate(0, -22);
                if (this.controls.force) ctx.rotate(-sin(this.age * TWO_PI * 4) * PI / 32);
                ctx.fillRect(-6, -7, 12, 15);
            });

            // Shield arm
            ctx.wrap(() => {
                // if (!this.controls.shield) return;

                ctx.fillStyle = '#888';
                ctx.translate(-10, -8);
                if (this.controls.force) ctx.rotate(-sin(this.age * TWO_PI * 2) * PI / 32);

                if (!this.controls.shield) ctx.rotate(Math.PI / 3);

                const armLength = this.controls.shield ? 25 : 10;
                ctx.fillRect(0, -3, armLength, 6);

                // Shield
                ctx.wrap(() => {
                    ctx.translate(armLength, 0);

                    if (!this.controls.shield) ctx.rotate(-Math.PI / 4);
                    // else ctx.translate(5, 0);

                    ctx.fillStyle = '#fff';

                    for (const [scale, color] of [[0.8, '#fff'], [0.6, '#888']]) {
                        ctx.fillStyle = color;
                        ctx.scale(scale, scale);
                        ctx.beginPath();
                        ctx.moveTo(0, -15);
                        ctx.lineTo(15, -10);
                        ctx.lineTo(12, 10);
                        ctx.lineTo(0, 25);
                        ctx.lineTo(-12, 10);
                        ctx.lineTo(-15, -10);
                        ctx.fill();
                    }
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
        this.controls.shield = DOWN[32];

        if (x) this.facing = x;
        
        this.x += cos(this.controls.angle) * this.controls.force * 200 * elapsed;
        this.y += sin(this.controls.angle) * this.controls.force * 200 * elapsed;

    }
}
