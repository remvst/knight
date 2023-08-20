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

        let y = 0;
        for (const type of [
            StickEnemy,
            StickAndShirtEnemy,
            SwordEnemy,
            SwordAndShieldEnemy,
            SwordAndArmorEnemy,
            TankEnemy,
        ]) {
            const enemy = this.scene.add(new type());;
            enemy.x = 200;
            enemy.y = y;

            this.scene.add(new CharacterHUD(enemy));

            y += 100;
        }

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
