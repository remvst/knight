class PlayerHUD extends Entity {
    constructor(player) {
        super();
        this.player = player;

        this.gauge = new Gauge(this.player);
    }

    get z() { 
        return LAYER_PLAYER_HUD; 
    }

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

        if (this.player.combo > 0) {
            ctx.wrap(() => {
                ctx.translate(420, 80);

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
