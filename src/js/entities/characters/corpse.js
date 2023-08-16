class Corpse extends Entity {
    constructor(renderElement) {
        super();
        this.renderElement = renderElement;
    }

    get z() { return Number.MIN_SAFE_INTEGER; }

    render() {
        super.render();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        this.renderElement();
    }
}
