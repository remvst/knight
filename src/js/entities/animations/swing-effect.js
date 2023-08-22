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
        globalAlpha = 1 - this.age / 0.2;

        translate(this.character.x, this.character.y);
        scale(this.character.facing, 1);
        translate(11, -42);

        strokeStyle = this.color;
        lineWidth = 40;
        beginPath();

        for (let r = 0 ; r < 1 ; r += 0.05) {
            wrap(() => {
                rotate(
                    interpolate(
                        this.fromAngle * PI / 2, 
                        this.toAngle * PI / 2,
                        r,
                    )
                );
                lineTo(18, -26);
            });
        }

        stroke();
    }
}
