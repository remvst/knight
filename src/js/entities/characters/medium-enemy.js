class MediumEnemy extends Character {
    constructor() {
        super();
        this.categories.push('enemy');
        this.targetTeam = 'player';

        this.controller = new EnemyAI(this);
        this.controller.setEntity(this);
        this.controller.start();

        this.timeToPrepareHeavyAttack = 1;
        this.timeToStrike = 0.05;
        this.timeToCooldown = 0.1;

        this.baseSpeed = 100;

        this.renderSteps = [
            (color, shadow) => renderAttackIndicator(this, color, shadow),
            (color) => renderLegs(this, color),
            (color) => renderChest(this, color),
            (color) => renderSword(this, color),
            (color) => renderShield(this, color),
            (color, shadow) => renderExhaustion(this, color, shadow, -70),
            (color, shadow) => renderExclamation(this, color, shadow),
        ];
    }
}
