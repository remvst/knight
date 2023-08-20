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


        const shield = { shield: true };
        const sword = { sword: true, attackCount: 2 };
        const stick = { stick: true, attackCount: 3 };
        const axe = { axe: true, attackCount: 1 };
        const armor = { armor: true };
        const superArmor = { superArmor: true };

        const StickEnemy = createEnemyType({ ...stick, });
        const AxeEnemy = createEnemyType({ ...axe, });
        const SwordEnemy = createEnemyType({ ...sword, });
        const AxeShieldArmorEnemy = createEnemyType({ ...axe, ...shield, ...armor, });
        const SwordArmorEnemy = createEnemyType({ ...sword, ...armor, });
        const SwordShieldArmorEnemy = createEnemyType({ ...sword, ...shield, ...armor, });
        const SwordShieldTankEnemy = createEnemyType({ ...sword,  ...shield, ...superArmor, });
        const AxeShieldTankEnemy = createEnemyType({ ...axe,  ...shield, ...superArmor, });

        const types = [
            AxeShieldTankEnemy,
            AxeShieldArmorEnemy,
            StickEnemy,
            AxeEnemy,
            SwordEnemy,
            SwordArmorEnemy,
            SwordShieldArmorEnemy,
            SwordShieldTankEnemy,
        ];

        // (async () => {
        //     let y = 0;
        //     for (const type of types) {
        //         const enemy = this.scene.add(new type());
        //         enemy.x = player.x + 200;
        //         enemy.y = player.y;
        //         enemy.poof();

        //         this.scene.add(new CharacterHUD(enemy));

        //         await this.scene.waitFor(() => enemy.health <= 0);
        //         await this.scene.delay(1);
        //     }
        // })();

        (async () => {
            for (let x = CANVAS_WIDTH ; x < CANVAS_WIDTH * 5; x += CANVAS_WIDTH) {
                await this.scene.waitFor(() => player.x >= x);

                for (let i = 0 ; i < 5 ; i++) {
                    const enemy = this.scene.add(new (pick(types))());
                    enemy.x = player.x + rnd(0, CANVAS_WIDTH / 2);
                    enemy.y = player.y + pick([-1, 1]) * evaluate(CANVAS_HEIGHT / 2 + 20);
                }
            }
        })();
    }
}
