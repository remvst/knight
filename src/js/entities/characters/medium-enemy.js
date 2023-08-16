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
            () => ctx.renderAttackIndicator(this),
            () => ctx.renderLegs(this),
            () => ctx.renderChest(this),
            () => ctx.renderArmAndSword(this),
            () => ctx.renderShield(this),
            () => ctx.renderExhaustion(this, -70),
            () => ctx.renderExclamation(this),
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }
}
