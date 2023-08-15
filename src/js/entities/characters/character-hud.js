class CharacterHUD extends Entity {
    constructor(character) {
        super();
        this.character = character;

        this.gauge = new Gauge(this.character);
    }

    get z() { return Number.MAX_SAFE_INTEGER; }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.gauge.cycle(elapsed);
        if (!this.character.health) this.remove();
    }

    render() {
        super.render();
        this.gauge.render(this.character.x - 25, this.character.y + 20, 50, 10);
    }
}
