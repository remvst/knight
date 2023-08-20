class SwingEffect extends Entity {
    constructor(character, color, fromAngle, toAngle) {
        super();
        this.character = character;
        this.color = color;
        this.fromAngle = fromAngle;
        this.toAngle = toAngle;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 0.2) this.remove();
    }

    doRender() {
        ctx.globalAlpha = 1 - this.age / 0.2;

        ctx.translate(this.x, this.y - 30);
        ctx.scale(this.character.facing, 1);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 40;
        ctx.beginPath();
        ctx.arc(0, 0, 40, this.fromAngle * PI / 2, this.toAngle * PI / 2, false);
        // ctx.arc(0, 0, 40, this.toAngle * PI / 4, 0, true);
        ctx.stroke();
    }
}
