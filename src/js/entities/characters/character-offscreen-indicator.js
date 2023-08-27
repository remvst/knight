class CharacterOffscreenIndicator extends Entity {
    constructor(character) {
        super();
        this.character = character;
    }

    get z() { 
        return LAYER_PLAYER_HUD; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (!this.character.health) this.remove();
    }

    doRender(camera) {
        if (
            abs(camera.x - this.character.x) < CANVAS_WIDTH / 2 / camera.appliedZoom &&
            abs(camera.y - this.character.y) < CANVAS_HEIGHT / 2 / camera.appliedZoom
        ) return;

        const x = between(
            camera.x - (CANVAS_WIDTH / 2 - 50) / camera.appliedZoom, 
            this.character.x,
            camera.x + (CANVAS_WIDTH / 2 - 50) / camera.appliedZoom,
        );
        const y = between(
            camera.y - (CANVAS_HEIGHT / 2 - 50) / camera.appliedZoom, 
            this.character.y,
            camera.y + (CANVAS_HEIGHT / 2 - 50) / camera.appliedZoom,
        );
        ctx.translate(x, y);

        ctx.beginPath();
        ctx.wrap(() => {
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 5;

            ctx.fillStyle = '#f00';
            ctx.rotate(angleBetween({x, y}, this.character));
            ctx.arc(0, 0, 20, -PI / 4, PI / 4, true);
            ctx.lineTo(40, 0);
            ctx.closePath();
            ctx.fill();

            ctx.shadowBlur = 0;

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, TWO_PI, true);
            ctx.fill();
        });
        ctx.clip();

        ctx.resolveColor = () => '#f00';
        ctx.scale(0.4, 0.4);
        ctx.translate(0, 30);
        ctx.scale(this.character.facing, 1);
        this.character.renderBody();
    }
}
