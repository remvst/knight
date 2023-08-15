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

        ctx.translate(20, 20);
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.fillRect(0, 0, 400, 20);

        ctx.fillStyle = '#900';
        ctx.fillRect(0, 0, 400 * this.player.health, 20);

        ctx.translate(0, 22);

        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.fillRect(0, 0, 400, 8);

        ctx.fillStyle = '#0ef';
        ctx.fillRect(0, 0, 400 * this.player.stamina, 8);
    }
}
