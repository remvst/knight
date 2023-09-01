class DummyEnemy extends Enemy {
    constructor() {
        super();
        this.categories.push('enemy');

        this.health = LARGE_INT;
    }

    renderBody() {
        ctx.wrap(() => {
            ctx.fillStyle = ctx.resolveColor(COLOR_WOOD);
            ctx.fillRect(-2, 0, 4, -20);
        });
        ctx.renderChest(this, COLOR_WOOD, CHEST_WIDTH_NAKED);
        ctx.renderHead(this, COLOR_WOOD);
    }

    dash() {}
}
