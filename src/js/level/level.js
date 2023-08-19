class Level {
    constructor() {
        this.scene = new Scene();

        const player = this.scene.add(new Player());
        this.scene.add(new PlayerHUD(player));
        this.scene.add(new Cursor(player));

        const fade = this.scene.add(new Fade());
        this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 2, linear))
            .await()
            .then(() => fade.remove());

        for (let i = 0 ; i < 0 ; i++) {
            const enemy = new TankEnemy();
            enemy.x = rnd(-600, 600);
            enemy.y = rnd(-600, 600);
            this.scene.add(enemy);

            this.scene.add(new CharacterHUD(enemy));
        }

        for (let i = 0 ; i < 0 ; i++) {
            const enemy = new SwordAndShieldEnemy();
            enemy.x = rnd(-600, 600);
            enemy.y = rnd(-600, 600);
            this.scene.add(enemy);

            this.scene.add(new CharacterHUD(enemy));
        }

        for (let i = 0 ; i < 400 ; i++) {
            const grass = new Grass();
            grass.x = random() * 10000;
            this.scene.add(grass);
        }

        for (let i = 0 ; i < 20 ; i++) {
            const tree = new Tree();
            tree.x = random() * 10000;
            this.scene.add(tree);
        }

        for (let i = 0 ; i < 20 ; i++) {
            const bush = new Bush();
            bush.x = random() * 10000;
            this.scene.add(bush);
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
    }

    cycle(elapsed) {
        this.scene.cycle(elapsed);

        const player = firstItem(this.scene.category('player'));
        const camera = firstItem(this.scene.category('camera'));
        if (!player) {
            // TODO game over
            return;
        }

        const dY = abs(player.y - this.scene.pathCurve(player.x));
        if (dY > 800 && !this.respawning) {
            (async () => {
                this.respawning = true;

                const fade = this.scene.add(new Fade());
                await this.scene.add(new Interpolator(fade, 'alpha', 0, 1, 2)).await();
                player.y = this.scene.pathCurve(player.x);
                camera.cycle(999);
                await this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();

                fade.remove();

                this.respawning = false;
            })();
        }
    }
}
