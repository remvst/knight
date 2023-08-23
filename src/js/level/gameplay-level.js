class GameplayLevel extends Level {
    constructor() {
        super();

        const { scene } = this;

        const player = firstItem(scene.category('player'));
        const camera = firstItem(scene.category('camera'));

        const playerHUD = scene.add(new PlayerHUD(player));
        scene.add(new Path());

        for (let i = 0 ; i < 15 ; i++) {
            const tree = new Tree();
            tree.x = rnd(-1, 1) * CANVAS_WIDTH / 2;
            tree.y = rnd(-1, 1) * CANVAS_HEIGHT / 2;
            scene.add(tree);
        }

        for (let i = 0 ; i < 20 ; i++) {
            const water = new Water();
            water.width = rnd(100, 200);
            water.height = rnd(200, 400);
            water.rotation = random() * TWO_PI;
            water.x = random() * CANVAS_WIDTH * 5;
            water.y = random() * CANVAS_HEIGHT * 5;
            scene.add(water);
        }

        // Respawn when far from the path
        (async () => {
            while (true) {
                await scene.waitFor(() => abs(player.y - scene.pathCurve(player.x)) > 1000);

                const fade = scene.add(new Fade());
                await scene.add(new Interpolator(fade, 'alpha', 0, 1, 2)).await();
                player.y = scene.pathCurve(player.x);
                camera.cycle(999);
                await scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();
                fade.remove();
            }
        })();

        // Scenario
        (async () => {
            const fade = scene.add(new Fade());
            await scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();
            fade.remove();

            scene.add(new Announcement(nomangle('The Path')));
            await scene.delay(2);

            let nextWaveX = player.x + CANVAS_WIDTH;
            for (let waveIndex = 1 ; waveIndex <= 13 ; waveIndex++) {
                // Show progress
                (async () => {
                    await scene.delay(1);
                    await scene.add(new Interpolator(playerHUD, 'progressAlpha', 0, 1, 1)).await();
                    await scene.add(new Interpolator(playerHUD, 'progress', playerHUD.progress, waveIndex / 13, 1)).await();
                    await scene.delay(2);
                    await scene.add(new Interpolator(playerHUD, 'progressAlpha', 1, 0, 1)).await();
                })();

                await scene.waitFor(() => player.x >= nextWaveX);

                this.scene.add(new Announcement(nomangle('Wave ') + waveIndex + '/13'));

                const waveEnemies = [];
                const enemyTypes = ENEMY_TYPES.slice(0, 1 + waveIndex / 2);
                for (let i = 0 ; i < 3 + waveIndex * 0.5 ; i++) {
                    const enemy = scene.add(new (pick(enemyTypes))());
                    enemy.x = player.x + rnd(-CANVAS_WIDTH / 2, CANVAS_WIDTH / 2);
                    enemy.y = player.y + pick([-1, 1]) * (evaluate(CANVAS_HEIGHT / 2) + rnd(20, 50));

                    scene.add(new CharacterHUD(enemy));

                    waveEnemies.push(enemy);
                }

                await Promise.all(waveEnemies.map(enemy => scene.waitFor(() => enemy.health <= 0)));

                // Slomo effect
                player.affectedBySpeedRatio = true;
                scene.speedRatio = 0.1;
                scene.add(new Interpolator(camera, 'zoom', camera.zoom, 3, 3));
                await scene.delay(3 * scene.speedRatio);
                await scene.add(new Interpolator(camera, 'zoom', camera.zoom, 1, 0.2)).await();
                scene.speedRatio = 1;
                player.affectedBySpeedRatio = false;

                this.scene.add(new Announcement(nomangle('Wave Cleared')));
                
                // Regen a bit of health
                player.health = min(player.maxHealth, player.health + player.maxHealth * 0.5);

                nextWaveX = player.x + CANVAS_WIDTH;
            }
            
            // TODO fight the king!
        })();

        // Game over
        (async () => {
            await scene.waitFor(() => player.health <= 0);

            scene.speedRatio = 0.1;
            scene.add(new Interpolator(camera, 'zoom', camera.zoom, 3, 5));
            await scene.delay(3 * scene.speedRatio);

            const fade = scene.add(new Fade());
            await scene.add(new Interpolator(fade, 'alpha', 0, 1, 2 * scene.speedRatio)).await();

            scene.speedRatio = 1;

            const expo = scene.add(new Exposition([pick([
                nomangle('The path to glory is a challenging one.'),
                nomangle('Giving up was never an option.'),
                nomangle('His first attempts weren\'t successful.'),
                nomangle('He did not reach the King until after several attempts.'),
                nomangle('Many followed his footsteps.'),
            ])]));

            await scene.delay(3);
            await scene.add(new Interpolator(expo, 'alpha', 1, 0, 2)).await();

            level = new GameplayLevel();
        })();
    }
}
