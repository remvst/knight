class PlayerHUD extends Entity {
    constructor(player) {
        super();
        this.player = player;

        this.gauge = new Gauge(this.player);
    }

    get z() { return Number.MAX_SAFE_INTEGER; }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.gauge.cycle(elapsed);
    }

    render() {
        super.render();

        const camera = firstItem(this.scene.category('camera'));

        ctx.translate(camera.x - CANVAS_WIDTH / 2, camera.y - CANVAS_HEIGHT / 2);

        ctx.shadowColor = '#000';
        ctx.shadowOffsetX = ctx.shadowOffsetY = 2;

        ctx.wrap(() => this.gauge.render(40, 30, 400, 30));

        ctx.wrap(() => {
            ctx.translate(40, 45);

            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, TWO_PI);
            ctx.fill();

            ctx.wrap(() => {
                ctx.shadowOffsetX = ctx.shadowOffsetY = 0;

                ctx.clip();
                ctx.resolveColor = () => '#fff';
                ctx.scale(0.6, 0.6);
                ctx.scale(this.player.facing, 1);
                ctx.translate(-this.player.x, -this.player.y + 30);
                this.player.render();
            });

            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, TWO_PI);
            ctx.stroke();
        });

        if (this.player.combo > 0) {
            ctx.wrap(() => {
                ctx.translate(440, 80);

                ctx.fillStyle = '#fff';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 4;
                ctx.textBaseline = nomangle('middle');
                ctx.textAlign = nomangle('right');
                ctx.font = nomangle('bold 36pt Impact');

                ctx.rotate(-PI / 32);

                const ratio = min(1, (this.player.age - this.player.lastComboChange) / 0.1);
                ctx.scale(1 + 1 - ratio, 1 + 1 - ratio);

                ctx.strokeText('X' + this.player.combo, 0, 0);
                ctx.fillText('X' + this.player.combo, 0, 0);
            });
        }
    }
}
