class TankEnemy extends Character {
    constructor() {
        super();
        this.categories.push('enemy');
        this.targetTeam = 'player';

        this.controller = new EnemyAI(this);
        this.controller.setEntity(this);
        this.controller.start();

        this.baseSpeed = 70;

        this.gibs = [
            () => ctx.renderSword(),
            () => ctx.renderShield(),
            () => {
                ctx.slice(30, true, 0.5);
                ctx.translate(0, 30);
                ctx.renderLegs(this);
                ctx.renderArmoredChest(this);
            },
            () => {
                ctx.slice(30, false, 0.5);
                ctx.translate(0, 30);
                ctx.renderLegs(this);
                ctx.renderArmoredChest(this);
            },
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }

    renderBody() {
        ctx.renderAttackIndicator(this);
        ctx.renderLegs(this);
        ctx.renderArmAndSword(this);
        ctx.renderArmoredChest(this);
        ctx.renderArmAndShield(this);
        ctx.renderExhaustion(this, -70);
        ctx.renderExclamation(this);
    }
}
