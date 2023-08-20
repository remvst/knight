class IntroLevel extends Level {
    constructor() {
        super();

        for (let r = 0 ; r < 1 ; r += 1 / 15) {
            const tree = this.scene.add(new Tree());
            tree.noRegen = true;
            tree.x = cos(r * TWO_PI) * 600 + rnd(-20, 20);
            tree.y = sin(r * TWO_PI) * 600 + rnd(-20, 20);
        }

        for (let r = 0 ; r < 1 ; r += 1 / 3) {
            const water = this.scene.add(new Water());
            water.x = cos(r * TWO_PI) * 300 + rnd(-50, 50);
            water.y = sin(r * TWO_PI) * 300 + rnd(-50, 50);
            water.rotation = random() * TWO_PI;
            water.width = rnd(50, 100);
            water.height = rnd(100, 200);
        }

        const camera = firstItem(this.scene.category('camera'));
        camera.zoom = 2;

        const player = firstItem(this.scene.category('player'));
        player.damageRatio = 0;

        camera.cycle(99);

        // TODO maybe remove this and use an already existing AI?
        class AttackAI extends EnemyAI {
            async doStart() {
                while (true) {
                    await this.startAI(new ReachPlayer());
                    await this.startAI(new Attack(1));
                    await this.startAI(new RetreatAI(200));
                    await this.startAI(new Wait(1));
                }
            }
        }

        // Respawn when leaving the area
        (async () => {
            while (true) {
                await this.waitFor(() => distP(player.x, player.y, 0, 0) > 500);

                const fade = this.scene.add(new Fade());
                await this.scene.add(new Interpolator(fade, 'alpha', 0, 1, 1)).await();
                player.x = player.y = 0;
                camera.cycle(999);
                await this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 1)).await();
                fade.remove();
            }
        })();

        (async () => {
            const fade = this.scene.add(new Fade());

            const logo = this.scene.add(new Logo());
            logo.x = player.x;
            logo.y = player.y - CANVAS_HEIGHT / 3;

            await this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();

            const msg = this.scene.add(new Instruction());

            // Movement tutorial
            msg.text = nomangle('Use [ARROW KEYS] or [WASD] to move');
            await this.waitFor(() => distP(player.x, player.y, 0, 0) > 50);
            await this.scene.add(new Interpolator(logo, 'alpha', 1, 0, 2)).await();
            logo.remove();

            msg.text = '';

            await this.scene.add(new Interpolator(camera, 'zoom', 2, 1, 2)).await();

            await this.delay(1);

            // Roll tutorial
            await this.repeat(
                msg,
                nomangle('Press [SPACE] to roll'),
                async () => {
                    await this.waitFor(() => player.stateMachine.state.dashAngle !== undefined);
                    await this.waitFor(() => player.stateMachine.state.dashAngle === undefined);
                },
                3,
            );

            // Attack tutorial
            const totalAttackCount = () => Array
                .from(this.scene.category('enemy'))
                .reduce((acc, enemy) => enemy.damageCount + acc, 0);

            for (let r = 0 ; r < 1 ; r += 1 / 5) {
                const enemy = this.scene.add(new DummyEnemy());
                enemy.x = cos(r * TWO_PI) * 200;
                enemy.y = sin(r * TWO_PI) * 200;
                enemy.poof();
            }

            await this.repeat(
                msg,
                nomangle('[LEFT CLICK] to strike a dummy'),
                async () => {
                    const initial = totalAttackCount();
                    await this.waitFor(() => totalAttackCount() > initial);
                },
                10,
            );

            // Charge tutorial
            await this.repeat(
                msg,
                nomangle('Hold [LEFT CLICK] to charge a heavy attack'),
                async () => {
                    await this.waitFor(() => player.stateMachine.state.attackPreparationRatio >= 1);

                    const initial = totalAttackCount();
                    await this.waitFor(() => totalAttackCount() > initial);
                },
                3,
            );

            // Shield tutorial 
            // TODO add an enemy to shield against

            const enemy = this.scene.add(new StickEnemy());
            enemy.x = camera.x + CANVAS_WIDTH / 2 / camera.zoom + 20;
            enemy.y = -99;
            enemy.damageRatio = 0;
            enemy.setController(new AttackAI());

            await this.repeat(
                msg,
                nomangle('Hold [RIGHT CLICK] or [SHIFT] to block attacks'),
                async () => {
                    const initial = player.parryCount;
                    await this.waitFor(() => player.parryCount > initial);
                },
                3,
            );

            this.scene.add(new CharacterHUD(enemy));

            enemy.damageRatio = 1;
            msg.text = nomangle('Now slay them!');
            await this.waitFor(() => enemy.health <= 0);

            msg.text = '';
            await this.delay(1);

            await this.scene.add(new Interpolator(fade, 'alpha', 0, 1, 2)).await();

            const expo = this.scene.add(new Exposition([
                nomangle('1254 AD'),
                nomangle('The Kingdom of Syldavia is being invaded by the Northern Empire.'),
                nomangle('The Syldavian army is outnumbered and outmatched.'),
                nomangle('One lone soldier decides to take on the king himself.'),
                nomangle('This is his story.'),
            ]));

            await this.delay(18);

            await this.scene.add(new Interpolator(expo, 'alpha', 1, 0, 2)).await();

            level = new GameplayLevel();
        })();
    }

    async repeat(msg, instruction, script, count) {
        for (let i = 0 ; i < count ; i++) {
            msg.text = instruction + ' (' + i + '/' + count + ')';
            await script();
        }
        
        msg.text = instruction + ' (' + count + '/' + count + ')';

        await this.delay(1);
        msg.text = '';
        await this.delay(1);
    }
}
