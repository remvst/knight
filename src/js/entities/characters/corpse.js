class Corpse extends Entity {
    constructor(renderElement, sliceType) {
        super();
        this.renderElement = renderElement;
        this.sliceType = sliceType;
    }

    get z() { return Number.MIN_SAFE_INTEGER; }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 5) this.remove();
    }

    render() {
        super.render();

        if (this.age > 3 && this.age % 0.25 < 0.125) return;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        this.renderElement();
    }
}
