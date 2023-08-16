class LightEnemy extends Character {
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
            () => ctx.renderAttackIndicator(this),
            () => ctx.renderLegs(this),
            () => ctx.renderNakedChest(this),
            () => ctx.renderStick(this),
            () => ctx.renderExhaustion(this, -70),
            () => ctx.renderExclamation(this),
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }
}
