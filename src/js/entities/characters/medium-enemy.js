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
            () => ctx.renderArmAndSword(this),
            () => ctx.renderArmoredChest(this),
            () => ctx.renderArmAndShield(this),
            () => ctx.renderExhaustion(this, -70),
            () => ctx.renderExclamation(this),
        ];

        this.tools = [
            () => ctx.renderSword(),
            () => ctx.renderShield(),
        ];

        this.body = () => {
            ctx.renderLegs(this);
            ctx.renderArmoredChest(this);
        };

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }
}
