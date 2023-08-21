class TestLevel extends Level {
    constructor() {
        super();

        const player = firstItem(this.scene.category('player'));
        this.scene.add(new PlayerHUD(player));

        this.scene.add(new Path())

        for (let r = 0 ; r < 1 ; r += 1 / 5) {
            const enemy = this.scene.add(new DummyEnemy());
            enemy.x = cos(r * TWO_PI) * 200;
            enemy.y = -400 + sin(r * TWO_PI) * 200;
            enemy.poof();
        }

        for (let r = 0 ; r < 1 ; r += 1 / 10) {
            const enemy = this.scene.add(new StickEnemy());
            enemy.x = cos(r * TWO_PI) * 400;
            enemy.y = sin(r * TWO_PI) * 400;
            enemy.poof();
        }

        // (async () => {
        //     let y = 0;
        //     for (const type of ENEMY_TYPES) {
        //         const enemy = this.scene.add(new type());
        //         enemy.x = player.x + 200;
        //         enemy.y = player.y;
        //         enemy.poof();

        //         this.scene.add(new CharacterHUD(enemy));

        //         await this.scene.waitFor(() => enemy.health <= 0);
        //         await this.scene.delay(1);
        //     }
        // })();
    }
}
