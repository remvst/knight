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

        ctx.wrap(() => this.gauge.render(20, 20, 400, 20));

        if (this.player.combo > 0) {
            ctx.wrap(() => {
                ctx.translate(420, 80);
                ctx.font = nomangle('bold 36pt Impact');
                ctx.fillStyle = '#fff';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.textAlign = nomangle('right');
                ctx.textBaseline = nomangle('middle');

                const ratio = min(1, (this.player.age - this.player.lastComboChange) / 0.1);
                ctx.scale(1 + 1 - ratio, 1 + 1 - ratio);

                ctx.rotate(-PI / 32);

                ctx.wrap(() => {
                    ctx.shadowColor = '#000';
                    ctx.shadowOffsetY = 8;
                    ctx.fillText('X' + this.player.combo, 0, 0);
                });
            });
        }
    }
}
