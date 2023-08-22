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
        translate(
            camera.x - evaluate(CANVAS_WIDTH / 2), 
            camera.y - evaluate(CANVAS_HEIGHT / 2),
        );

        wrap(() => {
            shadowColor = '#000';
            shadowBlur = 2;
    
            translate(CANVAS_WIDTH / 2, 30);
            this.gauge.render(400, 20);
        });

        if (this.player.combo > 0) {
            wrap(() => {
                translate(CANVAS_WIDTH / 2 + 200, 70);

                fillStyle = '#fff';
                strokeStyle = '#000';
                lineWidth = 4;
                textBaseline = nomangle('middle');
                textAlign = nomangle('right');
                font = nomangle('bold 36pt Impact');

                rotate(-PI / 32);

                const ratio = min(1, (this.player.age - this.player.lastComboChange) / 0.1);
                scale(1 + 1 - ratio, 1 + 1 - ratio);

                strokeText('X' + this.player.combo, 0, 0);
                fillText('X' + this.player.combo, 0, 0);
            });
        }
    }
}
