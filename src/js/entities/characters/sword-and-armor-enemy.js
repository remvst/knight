class SwordAndArmorEnemy extends Character {
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
        ctx.renderArm(this, COLOR_LEGS, () => ctx.renderSword());
        ctx.renderChest(this, COLOR_ARMOR, CHEST_WIDTH_ARMORED);
        ctx.renderHead(this, COLOR_SKIN);
        ctx.renderExhaustion(this, -70);
        ctx.renderExclamation(this);
    }
}
