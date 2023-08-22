class GameplayLevel extends Level {
    constructor() {
        super();

        const player = firstItem(this.scene.category('player'));
        const camera = firstItem(this.scene.category('camera'));

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

            let nextWaveX = player.x + CANVAS_WIDTH;
            for (let waveIndex = 0 ; waveIndex < 13 ; waveIndex++) {
                await this.scene.waitFor(() => player.x >= nextWaveX);
                nextWaveX = player.x + CANVAS_WIDTH;

                const waveEnemies = [];
                for (let i = 0 ; i < 3 + waveIndex * 0.5 ; i++) {
                    const enemy = this.scene.add(new (pick(ENEMY_TYPES))());
                    enemy.x = player.x + rnd(-CANVAS_WIDTH / 2, CANVAS_WIDTH / 2);
                    enemy.y = player.y + pick([-1, 1]) * (evaluate(CANVAS_HEIGHT / 2) + rnd(20, 50));

                    this.scene.add(new CharacterHUD(enemy));

                    waveEnemies.push(enemy);
                }

                await Promise.all(waveEnemies.map(enemy => this.scene.waitFor(() => enemy.health <= 0)));
                
                // Regen a bit of health
                player.health = min(player.maxHealth, player.health + player.maxHealth * 0.5);
            }
            
            // TODO fight the king!
        })();

        // Game over
        (async () => {
            await this.scene.waitFor(() => player.health <= 0);
            await this.scene.delay(1);

            const fade = this.scene.add(new Fade());
            await this.scene.add(new Interpolator(fade, 'alpha', 0, 1, 2)).await();

            const expo = this.scene.add(new Exposition([pick([
                nomangle('The path to glory is a challenging one.'),
                nomangle('Giving up was never an option.'),
                nomangle('His first attempts weren\'t successful.'),
                nomangle('He did not reach the King until after several attempts.'),
                nomangle('Many followed his footsteps.'),
            ])]));

            await this.scene.delay(3);
            await this.scene.add(new Interpolator(expo, 'alpha', 1, 0, 2)).await();

            level = new GameplayLevel();
        })();
    }
}
