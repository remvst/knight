class Corpse extends Entity {
    constructor(character) {
        super();
        this.character = character;
        this.x = character.x;
        this.y = character.y;
    }

    render() {
        super.render();

        console.log('haha corpse render!');

        const { inWater } = this.character;
        if (inWater) {
            ctx.beginPath();
            ctx.rect(this.x-100, this.y-100, 200, 100);
            ctx.clip();
        }

        ctx.translate(this.x, this.y);

        const progress = min(1, this.age / 0.5);
        ctx.rotate(PI / 2 * -this.character.facing * progress);

        // ctx.withShadow((color, shadow) => {
            for (const step of this.character.renderSteps) {
                ctx.wrap(() => step(c => this.character.getColor(c), false));
            }
        // });
    }
}
