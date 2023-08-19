class DummyEnemy extends Character {
    constructor() {
        super();
        this.categories.push('enemy');
        this.targetTeam = 'player';

        this.baseSpeed = 100;

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }

    renderBody() {
        ctx.wrap(() => {
            ctx.fillStyle = ctx.resolveColor('brown');
            ctx.fillRect(-2, 0, 4, -30);
        });
        ctx.renderChest(this, COLOR_WOOD, CHEST_WIDTH_NAKED);
        ctx.renderHead(this, COLOR_WOOD);
    }
}
