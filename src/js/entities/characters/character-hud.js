class CharacterHUD extends Entity {
    constructor(character) {
        super();
        this.character = character;
    }

    get z() { return Number.MAX_SAFE_INTEGER; }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (!this.character.health) this.remove();
    }

    render() {
        super.render();

        ctx.translate(this.character.x - 25, this.character.y + 20);
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.fillRect(0, 0, 50, 10);

        ctx.fillStyle = '#900';
        ctx.fillRect(0, 0, 50 * this.character.health, 10);

        ctx.translate(0, 10);

        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.fillRect(0, 0, 50, 2);

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 50 * this.character.stamina, 2);
    }
}
