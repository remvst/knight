class PlayerHUD extends Entity {
    constructor(player) {
        super();
        this.player = player;
    }

    get z() { return Number.MAX_SAFE_INTEGER; }

    render() {
        super.render();

        const camera = firstItem(this.scene.category('camera'));

        ctx.translate(camera.x - CANVAS_WIDTH / 2, camera.y - CANVAS_HEIGHT / 2);

        ctx.wrap(() => {
            ctx.translate(20, 20);
            
            ctx.fillStyle = 'rgba(0,0,0,.5)';
            ctx.fillRect(0, 0, 400, 20);
    
            ctx.fillStyle = '#900';
            ctx.fillRect(0, 0, 400 * this.player.health, 20);
    
            ctx.translate(0, 20);
    
            ctx.fillStyle = 'rgba(0,0,0,.5)';
            ctx.fillRect(0, 0, 400, 4);
    
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, 400 * this.player.stamina, 4);
        });

        if (this.player.age - this.player.lastComboChange < 2) {
            ctx.wrap(() => {
                ctx.translate(220, 80);
                ctx.font = nomangle('bold 24pt Impact');
                ctx.fillStyle = '#fff';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.textAlign = nomangle('center');
                ctx.textBaseline = nomangle('middle');

                ctx.rotate(-PI / 32);

                const ratio = min(1, (this.player.age - this.player.lastComboChange) / 0.1);
                ctx.translate((1 - ratio) * 100, 0);

                ctx.wrap(() => {
                    ctx.shadowColor = '#000';
                    ctx.shadowOffsetY = 5;
                    ctx.fillText(this.player.lastComboChangeReason, 0, 0);
                });
                ctx.strokeText(this.player.lastComboChangeReason, 0, 0);
            });
        }

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
                    ctx.shadowOffsetY = 5;
                    ctx.fillText('X' + this.player.combo, 0, 0);
                });
                ctx.strokeText('X' + this.player.combo, 0, 0);
            });
        }
    }
}
