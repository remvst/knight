class SwingEffect extends Entity {
    constructor(character, color, fromAngle, toAngle) {
        super();
        this.character = character;
        this.color = color;
        this.fromAngle = fromAngle;
        this.toAngle = toAngle;
        this.affectedBySpeedRatio = character.affectedBySpeedRatio;
    }

    get z() {
        return LAYER_ANIMATIONS;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 0.2) this.remove();
    }

    doRender() {
        ctx.globalAlpha = 1 - this.age / 0.2;

        ctx.translate(this.character.x, this.character.y);
        ctx.scale(this.character.facing, 1);
        ctx.translate(11, -42);

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 40;
        ctx.beginPath();

        for (let r = 0 ; r < 1 ; r += 0.05) {
            ctx.wrap(() => {
                ctx.rotate(
                    interpolate(
                        this.fromAngle * PI / 2, 
                        this.toAngle * PI / 2,
                        r,
                    )
                );
                ctx.lineTo(18, -26);
            });
        }

        ctx.stroke();
    }
}
