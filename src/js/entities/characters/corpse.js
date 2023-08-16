class Corpse extends Entity {
    constructor(renderElement) {
        super();
        this.renderElement = renderElement;
    }

    render() {
        super.render();

        this.renderElement(this.x, this.y);
    }
}
