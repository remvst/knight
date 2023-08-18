class StickAndShirtEnemy extends Character {
    constructor() {
        super();
        this.categories.push('enemy');
        this.targetTeam = 'player';

        this.controller = new EnemyAI(this);
        this.controller.setEntity(this);
        this.controller.start();

        this.baseSpeed = 100;

        this.gibs = [
            () => ctx.renderStick(),
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }

    renderBody() {
        ctx.renderAttackIndicator(this);
        ctx.renderLegs(this, COLOR_LEGS);
        ctx.renderArm(this, COLOR_SKIN, () => ctx.renderStick(this));
        ctx.renderChest(this, COLOR_SHIRT, CHEST_WIDTH_ARMORED);
        ctx.renderHead(this, COLOR_SKIN);
        ctx.renderExhaustion(this, -70);
        ctx.renderExclamation(this);
    }
}
