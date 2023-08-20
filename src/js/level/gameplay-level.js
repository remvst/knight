class GameplayLevel extends Level {
    constructor() {
        super();

        const player = firstItem(this.scene.category('player'));

        this.scene.add(new PlayerHUD(player));
        this.scene.add(new Path());

        for (let i = 0 ; i < 20 ; i++) {
            const tree = new Tree();
            tree.x = random() * 10000;
            this.scene.add(tree);
        }

        for (let x = 0 ; x < 10000 ; x += 300) {
            const water = new Water();
            water.width = rnd(100, 200);
            water.height = rnd(200, 400);
            water.rotation = random() * TWO_PI;
            water.x = x;
            water.y = this.scene.pathCurve(water.x) + rnd(300, 800) * pick([-1, 1]);
            this.scene.add(water);
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
                enemy.x = 200;
                enemy.y = y;
                enemy.poof();

                await this.scene.waitFor(() => enemy.health <= 0);
                await this.scene.delay(1);
            }
        })();

        // Respawn when far from the path
        (async () => {
            while (true) {
                await this.scene.waitFor(() => abs(player.y - this.scene.pathCurve(player.x)) > 1000);

                const fade = this.scene.add(new Fade());
                await this.scene.add(new Interpolator(fade, 'alpha', 0, 1, 2)).await();
                player.y = this.scene.pathCurve(player.x);
                camera.cycle(999);
                await this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();
                fade.remove();
            }
        })();

        // Scenario
        (async () => {
            const fade = this.scene.add(new Fade());
            await this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();
            fade.remove();
        })();
    }
}
