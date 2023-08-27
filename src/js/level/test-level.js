class TestLevel extends Level {
    constructor() {
        super();

        const player = firstItem(this.scene.category('player'));
        this.scene.add(new PlayerHUD(player));

        const camera = firstItem(this.scene.category('camera'));
        // camera.zoom = 3;

        // player.health = player.maxHealth = Number.MAX_SAFE_INTEGER;

        this.scene.add(new Path())

        for (let r = 0 ; r < 1 ; r += 1 / 5) {
            const enemy = this.scene.add(new StickEnemy());
            enemy.x = cos(r * TWO_PI) * 200;
            enemy.y = -400 + sin(r * TWO_PI) * 200;
            enemy.poof();

            this.scene.add(new CharacterHUD(enemy));
        }

        // const king = this.scene.add(new KingEnemy());
        // king.x = 400;
        // this.scene.add(new CharacterHUD(king));

        // for (let r = 0 ; r < 1 ; r += 1 / 10) {
        //     const type = pick(ENEMY_TYPES);
        //     const enemy = this.scene.add(new type());
        //     enemy.x = cos(r * TWO_PI) * 400;
        //     enemy.y = sin(r * TWO_PI) * 400;
        //     enemy.poof();

        //     this.scene.add(new CharacterHUD(enemy));
        // }

        for (let i = 0 ; i < 20 ; i++) {
            const tree = new Tree();
            tree.x = random() * 10000;
            this.scene.add(tree);
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
