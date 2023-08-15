class Cursor extends Entity {
    constructor(player) {
        super();
        this.player = player;
    }

    get z() { return Number.MIN_SAFE_INTEGER; }

    render() {
        super.render();

        ctx.translate(this.player.controls.aim.x, this.player.controls.aim.y);

        ctx.fillStyle = '#000';
        ctx.rotate(PI / 4);
        ctx.fillRect(-15, -5, 30, 10);
        ctx.rotate(PI / 2);
        ctx.fillRect(-15, -5, 30, 10);
    }
}
