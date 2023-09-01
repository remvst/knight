class GameplayLevel extends Level {
    constructor(waveIndex = 0, score = 0) {
        super();

        const { scene } = this;

        let waveStartScore = score;

        const player = firstItem(scene.category('player'));
        player.x = waveIndex * CANVAS_WIDTH;
        player.y = scene.pathCurve(player.x);
        player.score = score;

        const camera = firstItem(scene.category('camera'));
        camera.cycle(99);

        const playerHUD = scene.add(new PlayerHUD(player));
        scene.add(new Path());

        for (let i = 0 ; i < 15 ; i++) {
            const tree = scene.add(new Tree());
            tree.x = rnd(-1, 1) * CANVAS_WIDTH / 2;
            tree.y = rnd(-1, 1) * CANVAS_HEIGHT / 2;
        }

        for (let i = 0 ; i < 20 ; i++) {
            const water = scene.add(new Water());
            water.width = rnd(100, 200);
            water.height = rnd(200, 400);
            water.rotation = random() * TWO_PI;
            water.x = random() * CANVAS_WIDTH * 5;
            water.y = random() * CANVAS_HEIGHT * 5;
        }

        // Respawn when far from the path
        (async () => {
            while (true) {
                await scene.waitFor(() => abs(player.y - scene.pathCurve(player.x)) > 1000 || player.x < camera.minX - CANVAS_WIDTH / 2);

                const x = max(camera.minX + CANVAS_WIDTH, player.x);
                await this.respawn(x, scene.pathCurve(x));
            }
        })();

        async function slowMo() {
            player.affectedBySpeedRatio = true;
            scene.speedRatio = 0.2;
            await camera.zoomTo(3);
            await scene.delay(1.5 * scene.speedRatio);
            await camera.zoomTo(1);
            scene.speedRatio = 1;
            player.affectedBySpeedRatio = false;
        }

        function spawnWave(enemyCount, enemyTypes) {
            return Array.apply(null, Array(enemyCount)).map(() => {
                const enemy = scene.add(new (pick(enemyTypes))());
                enemy.x = player.x + rnd(-CANVAS_WIDTH / 2, CANVAS_WIDTH / 2);
                enemy.y = player.y + pick([-1, 1]) * (evaluate(CANVAS_HEIGHT / 2) + rnd(50, 100));
                scene.add(new CharacterHUD(enemy));
                scene.add(new CharacterOffscreenIndicator(enemy));
                return enemy
            });
        }

        // Scenario
        (async () => {
            const fade = scene.add(new Fade());
            await scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();

            scene.add(new Announcement(nomangle('The Path')));
            await scene.delay(2);

            playerHUD.progress = playerHUD.progressGauge.displayedValue = waveIndex / WAVE_COUNT;

            let nextWaveX = player.x + CANVAS_WIDTH;
            for ( ; waveIndex < WAVE_COUNT ; waveIndex++) {
                // Show progress
                (async () => {
                    await scene.delay(1);
                    await scene.add(new Interpolator(playerHUD, 'progressAlpha', 0, 1, 1)).await();
                    playerHUD.progress = waveIndex / WAVE_COUNT;

                    // Regen a bit of health
                    player.heal(player.maxHealth * 0.5);

                    await scene.delay(3);
                    await scene.add(new Interpolator(playerHUD, 'progressAlpha', 1, 0, 1)).await();
                })();

                const instruction = scene.add(new Instruction());
                (async () => {
                    await scene.delay(10),
                    instruction.text = nomangle('Follow the path to the right');
                })();

                await scene.waitFor(() => player.x >= nextWaveX);

                instruction.remove();
                waveStartScore = player.score;

                this.scene.add(new Announcement(nomangle('Wave ') + (waveIndex + 1)));

                const waveEnemies = spawnWave(
                    3 + waveIndex,
                    WAVE_SETTINGS[min(WAVE_SETTINGS.length - 1, waveIndex)],
                );

                // Wait until all enemies are defeated
                await Promise.all(waveEnemies.map(enemy => scene.waitFor(() => enemy.health <= 0)));
                slowMo();

                this.scene.add(new Announcement(nomangle('Wave Cleared')));

                nextWaveX = player.x + evaluate(CANVAS_WIDTH * 2);
                camera.minX = player.x - CANVAS_WIDTH;
            }

            // Last wave, reach the king
            await scene.waitFor(() => player.x >= nextWaveX);
            const king = scene.add(new KingEnemy());
            king.x = camera.x + CANVAS_WIDTH + 50;
            king.y = scene.pathCurve(king.x);
            scene.add(new CharacterHUD(king));

            await scene.waitFor(() => king.x - player.x < 400);
            await scene.add(new Interpolator(fade, 'alpha', 0, 1, 2 * scene.speedRatio)).await();

            // Make sure the player is near the king
            player.x = king.x - 400;
            player.y = scene.pathCurve(player.x);

            const expo = scene.add(new Exposition([
                nomangle('At last, he faced the emperor.'),
            ]));

            await scene.delay(3);
            await scene.add(new Interpolator(expo, 'alpha', 1, 0, 2)).await();
            await scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();

            // Give the king an AI so they can start fighting
            const aiType = createEnemyAI({
                shield: true, 
                attackCount: 3,
            });
            king.setController(new aiType());
            scene.add(new CharacterOffscreenIndicator(king));

            // Spawn some mobs
            spawnWave(5, WAVE_SETTINGS[WAVE_SETTINGS.length - 1]);

            await scene.waitFor(() => king.health <= 0);

            player.health = player.maxHealth = 999;
            BEATEN = true;

            // Final slomo
            await slowMo();
            await scene.add(new Interpolator(fade, 'alpha', 0, 1, 2 * scene.speedRatio)).await();

            // Congrats screen
            const finalExpo = scene.add(new Exposition([
                nomangle('After an epic fight, the emperor was defeated.'),
                nomangle('Our hero\'s quest was complete.'),
                nomangle('Historians estimate his final score was ') + player.score.toLocaleString() + '.',
            ]));
            await scene.add(new Interpolator(finalExpo, 'alpha', 0, 1, 2 * scene.speedRatio)).await();
            await scene.delay(9 * scene.speedRatio);
            await scene.add(new Interpolator(finalExpo, 'alpha', 1, 0, 2 * scene.speedRatio)).await();

            // Back to intro
            level = new IntroLevel();
        })();

        // Game over
        (async () => {
            await scene.waitFor(() => player.health <= 0);

            slowMo();

            const fade = scene.add(new Fade());
            await scene.add(new Interpolator(fade, 'alpha', 0, 1, 2 * scene.speedRatio)).await();
            scene.speedRatio = 2;

            const expo = scene.add(new Exposition([
                // Story
                pick([
                    nomangle('Failing never affected his will, only his score.'),
                    nomangle('Giving up was never an option.'),
                    nomangle('His first attempts weren\'t successful.'),
                    nomangle('After licking his wounds, he resumed his quest.'),
                ]), 

                // Tip
                pick([
                    nomangle('His shield would not fail him again ([SHIFT] / [RIGHT CLICK])'),
                    nomangle('Rolling would help him dodge attacks ([SPACE] / [CTRL])'),
                    nomangle('Heavy attacks would be key to his success'),
                ]),
            ]));

            await scene.delay(6);
            await scene.add(new Interpolator(expo, 'alpha', 1, 0, 2)).await();

            // Start a level where we left off
            level = new GameplayLevel(waveIndex, max(0, waveStartScore - 5000)); // TODO figure out a value
        })();
    }
}
