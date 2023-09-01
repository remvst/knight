class PlayerHUD extends Entity {
    constructor(player) {
        super();
        this.player = player;

        this.healthGauge = new Gauge(() => this.player.health / this.player.maxHealth);
        this.staminaGauge = new Gauge(() => this.player.stamina);
        this.progressGauge = new Gauge(() => this.progress);

        this.healthGauge.regenRate = 0.1;
        this.progressGauge.regenRate = 0.1;

        this.progressGauge.displayedValue = 0;

        this.progress = 0;
        this.progressAlpha = 0;

        this.dummyPlayer = new Player();
        this.dummyKing = new KingEnemy();

        this.affectedBySpeedRatio = false;
    }

    get z() { 
        return LAYER_PLAYER_HUD; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.healthGauge.cycle(elapsed);
        this.staminaGauge.cycle(elapsed);
        this.progressGauge.cycle(elapsed);
    }

    doRender(camera) {
        this.cancelCameraOffset(camera);

        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH / 2, 50);
            ctx.wrap(() => {
                ctx.translate(0, 10);
                this.staminaGauge.render(300, 20, staminaGradient, true);
            });
            this.healthGauge.render(400, 20, healthGradient);
        });

        ctx.wrap(() => {
            ctx.globalAlpha = this.progressAlpha;

            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 150);
            this.progressGauge.render(600, 10, '#fff', false, WAVE_COUNT);

            ctx.resolveColor = () => '#fff';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 1;

            ctx.wrap(() => {
                ctx.translate(interpolate(-300, 300, this.progressGauge.displayedValue), 20);
                ctx.scale(0.5, 0.5);
                this.dummyPlayer.renderBody();
            });

            ctx.wrap(() => {
                ctx.translate(300, 20);
                ctx.scale(-0.5, 0.5);
                this.dummyKing.renderBody();
            });
        });

        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH / 2, 90);

            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;
            ctx.textBaseline = nomangle('top');
            ctx.textAlign = nomangle('center');
            ctx.font = nomangle('bold 16pt Times New Roman');
            ctx.strokeText(nomangle('SCORE: ') + this.player.score.toLocaleString(), 0, 0);
            ctx.fillText(nomangle('SCORE: ') + this.player.score.toLocaleString(), 0, 0);
        });

        if (this.player.combo > 0) {
            ctx.wrap(() => {
                ctx.translate(CANVAS_WIDTH / 2 + 200, 70);

                ctx.fillStyle = '#fff';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 4;
                ctx.textBaseline = nomangle('middle');
                ctx.textAlign = nomangle('right');
                ctx.font = nomangle('bold 36pt Times New Roman');

                ctx.rotate(-PI / 32);

                const ratio = min(1, (this.player.age - this.player.lastComboChange) / 0.1);
                ctx.scale(1 + 1 - ratio, 1 + 1 - ratio);

                ctx.strokeText('X' + this.player.combo, 0, 0);
                ctx.fillText('X' + this.player.combo, 0, 0);
            });
        }
    }
}
