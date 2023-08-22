class Cursor extends Entity {
    constructor(player) {
        super();
        this.player = player;
    }

    get z() { 
        return LAYER_PLAYER_HUD;
    }

    doRender() {
        translate(this.player.controls.aim.x, this.player.controls.aim.y);

        fillStyle = '#000';
        rotate(PI / 4);
        fillRect(-15, -5, 30, 10);
        rotate(PI / 2);
        fillRect(-15, -5, 30, 10);
    }
}
