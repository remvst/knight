class SwordEnemy extends Character {
    constructor() {
        super();
        this.categories.push('enemy');
        this.targetTeam = 'player';

        this.baseSpeed = 70;

        this.gibs = [
            () => ctx.renderSword(),
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }

    renderBody() {
        ctx.renderAttackIndicator(this);
        ctx.renderLegs(this, COLOR_LEGS);
        ctx.renderArm(this, COLOR_SKIN, () => ctx.renderSword());
        ctx.renderChest(this, COLOR_SKIN, CHEST_WIDTH_NAKED);
        ctx.renderHead(this, COLOR_SKIN);
        ctx.renderExhaustion(this, -70);
        ctx.renderExclamation(this);
    }
}
