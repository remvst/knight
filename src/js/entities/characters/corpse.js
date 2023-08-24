class Corpse extends Entity {
    constructor(renderElement, sliceType) {
        super();
        this.renderElement = renderElement;
        this.sliceType = sliceType;
    }

    get z() { 
        return LAYER_CORPSE; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 5) this.remove();

        if (this.age < 0.5) {
            this.scene.add(new Particle(
                '#900',
                [3, 6],
                [this.x, this.x + rnd(-20, 20)],
                [this.y, this.y + rnd(-20, 20)],
                rnd(0.5, 1),
            ));
        }
    }

    doRender() {
        if (this.age > 3 && this.age % 0.25 < 0.125) return;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        this.renderElement();
    }
}
