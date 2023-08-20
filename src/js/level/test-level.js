class TestLevel extends Level {
    constructor() {
        super();

        const player = firstItem(this.scene.category('player'));
        this.scene.add(new PlayerHUD(player));

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

        (async () => {
            let y = 0;
            for (const type of [
                StickEnemy,
                AxeEnemy,
                SwordEnemy,
                AxeShieldArmorEnemy,
                SwordArmorEnemy,
                SwordShieldArmorEnemy,
                SwordShieldTankEnemy,
                AxeShieldTankEnemy,
            ]) {
                const enemy = this.scene.add(new type());
                enemy.x = player.x + 200;
                enemy.y = player.y;
                enemy.poof();

                this.scene.add(new CharacterHUD(enemy));

                await this.scene.waitFor(() => enemy.health <= 0);
                await this.scene.delay(1);
            }
        })();
    }
}
