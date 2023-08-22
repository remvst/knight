class DummyEnemy extends Character {
    constructor() {
        super();
        this.categories.push('enemy');
        this.targetTeam = 'player';

        this.baseSpeed = 100;

        this.health = this.maxHealth = Number.MAX_SAFE_INTEGER;

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }

    renderBody() {
        wrap(() => {
            fillStyle = resolveColor(COLOR_WOOD);
            fillRect(-2, 0, 4, -20);
        });
        renderChest(this, COLOR_WOOD, CHEST_WIDTH_NAKED);
        renderHead(this, COLOR_WOOD);
    }

    dash() {}
}
