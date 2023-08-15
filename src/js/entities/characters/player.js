class Player extends Character {
    constructor() {
        super();
        this.categories.push('player');

        this.targetTeam = 'enemy';

        this.controller = new PlayerController();
        this.controller.setEntity(this);

        this.renderSteps = [
            (color) => renderLegs(this, color),
            (color) => renderChest(this, color),
            (color) => renderSword(this, color),
            (color) => renderShield(this, color),
            (color, shadow) => renderExhaustion(this, color, shadow, -70),
        ];
    }
}
