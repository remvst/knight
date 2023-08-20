class CharacterHUD extends Entity {
    constructor(character) {
        super();
        this.character = character;

        this.gauge = new Gauge(this.character);
    }

    get z() { 
        return LAYER_CHARACTER_HUD; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.gauge.cycle(elapsed);
        if (!this.character.health) this.remove();
    }

    doRender() {
        if (this.character.health > 0.5 && this.character.age - this.character.lastDamage > 2) return;
 
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 3;

        this.gauge.render(this.character.x - 50, this.character.y + 20, 100, 15);
    }
}
