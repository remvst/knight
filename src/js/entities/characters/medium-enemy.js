class MediumEnemy extends Character {
    constructor() {
        super();
        this.categories.push('enemy');
        this.targetTeam = 'player';

        this.controller = new EnemyAI(this);
        this.controller.setEntity(this);
        this.controller.start();

        this.baseSpeed = 70;

        this.renderSteps = [
            (color, shadow) => renderAttackIndicator(this, color, shadow),
            (color) => renderLegs(this, color),
            (color) => renderChest(this, color),
            (color) => renderSword(this, color),
            (color) => renderShield(this, color),
            (color, shadow) => renderExhaustion(this, color, shadow, -70),
            (color, shadow) => renderExclamation(this, color, shadow),
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }
}
