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
        if (
            this.character.health > 0.5 && 
            this.character.age - max(this.character.lastStaminaLoss, this.character.lastDamage) > 2
        ) return;
 
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 1;

        ctx.translate(this.character.x, this.character.y + 20);
        this.gauge.render(80, 5);
    }
}
