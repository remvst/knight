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

    doRender(camera) {
        ctx.translate(camera.x - CANVAS_WIDTH / 2, camera.y - CANVAS_HEIGHT / 2);

        ctx.wrap(() => {
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 2;
    
            ctx.translate(CANVAS_WIDTH / 2, 30);
            this.gauge.render(400, 20);
        });

        if (this.player.combo > 0) {
            ctx.wrap(() => {
                ctx.translate(CANVAS_WIDTH / 2 + 200, 70);

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
