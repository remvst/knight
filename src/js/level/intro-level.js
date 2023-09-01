class IntroLevel extends Level {
    constructor() {
        super();

        const { scene } = this;

        for (let r = 0 ; r < 1 ; r += 1 / 15) {
            const tree = scene.add(new Tree());
            tree.noRegen = true;
            tree.x = cos(r * TWO_PI) * 600 + rnd(-20, 20);
            tree.y = sin(r * TWO_PI) * 600 + rnd(-20, 20);
        }

        const camera = firstItem(scene.category('camera'));
        camera.zoom = 3;
        camera.cycle(99);

        const player = firstItem(scene.category('player'));
        player.health = LARGE_INT;
        player.setController(new CharacterController());

        // Respawn when leaving the area
        (async () => {
            while (true) {
                await scene.waitFor(() => distP(player.x, player.y, 0, 0) > 650);
                await this.respawn(0, 0);
            }
        })();

        (async () => {
            const logo = scene.add(new Logo());
            const fade = scene.add(new Fade());
            await scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();

            const msg = scene.add(new Instruction());
            msg.text = nomangle('[CLICK] to follow the path');
            await new Promise(r => onclick = r);
            msg.text = '';

            playSong();

            can.style[nomangle('cursor')] = 'none';

            player.setController(new PlayerController());
            await scene.add(new Interpolator(logo, 'alpha', 1, 0, 2)).await();
            await camera.zoomTo(1);

            scene.add(new Announcement(nomangle('Prologue')))

            // Movement tutorial
            msg.text = nomangle('Use [ARROW KEYS] or [WASD] to move');
            await scene.waitFor(() => distP(player.x, player.y, 0, 0) > 200);
            logo.remove();

            msg.text = '';

            await scene.delay(1);

            // Roll tutorial
            await this.repeat(
                msg,
                nomangle('Press [SPACE] or [CTRL] to roll'),
                async () => {
                    await scene.waitFor(() => player.stateMachine.state.dashAngle !== undefined);
                    await scene.waitFor(() => player.stateMachine.state.dashAngle === undefined);
                },
                3,
            );

            // Attack tutorial
            const totalAttackCount = () => Array
                .from(scene.category('enemy'))
                .reduce((acc, enemy) => enemy.damageCount + acc, 0);

            for (let r = 0 ; r < 1 ; r += 1 / 5) {
                const enemy = scene.add(new DummyEnemy());
                enemy.x = cos(r * TWO_PI) * 200;
                enemy.y = sin(r * TWO_PI) * 200;
                enemy.poof();
            }

            await this.repeat(
                msg,
                nomangle('[LEFT CLICK] to strike a dummy'),
                async () => {
                    const initial = totalAttackCount();
                    await scene.waitFor(() => totalAttackCount() > initial);
                },
                10,
            );

            // Charge tutorial
            await this.repeat(
                msg,
                nomangle('Hold [LEFT CLICK] to charge a heavy attack'),
                async () => {
                    await scene.waitFor(() => player.stateMachine.state.attackPreparationRatio >= 1);

                    const initial = totalAttackCount();
                    await scene.waitFor(() => totalAttackCount() > initial);
                },
                3,
            );

            // Shield tutorial 
            const SwordArmorEnemy = createEnemyType({ sword: true, armor: true, attackCount: 1, });
            const enemy = scene.add(new SwordArmorEnemy());
            enemy.health = LARGE_INT;
            enemy.x = camera.x + CANVAS_WIDTH / 2 / camera.zoom + 20;
            enemy.y = -99;
            scene.add(new CharacterOffscreenIndicator(enemy));

            await this.repeat(
                msg,
                nomangle('Hold [RIGHT CLICK] or [SHIFT] to block attacks'),
                async () => {
                    const initial = player.parryCount;
                    await scene.waitFor(() => player.parryCount > initial);
                },
                3,
            );

            scene.add(new CharacterHUD(enemy));

            enemy.health = enemy.maxHealth = 100;
            msg.text = nomangle('Now slay them!');
            await scene.waitFor(() => enemy.health <= 0);

            msg.text = '';
            await scene.delay(1);

            await scene.add(new Interpolator(fade, 'alpha', 0, 1, 2)).await();

            const expo = scene.add(new Exposition([
                nomangle('1254 AD'),
                nomangle('The Kingdom of Syldavia is being invaded by the Northern Empire.'),
                nomangle('The Syldavian army is outnumbered and outmatched.'),
                nomangle('One lone soldier decides to take on the emperor himself.'),
            ]));

            await scene.delay(15);

            await scene.add(new Interpolator(expo, 'alpha', 1, 0, 2)).await();

            level = new GameplayLevel();
        })();

        (async () => {
            const enemy = scene.add(new DummyEnemy());
            enemy.y = -550;
            enemy.poof();

            const label = scene.add(new Label(nomangle('Skip')));
            label.y = enemy.y - 30;
            label.infinite = true;

            while (true) {
                const { damageCount } = enemy;
                await scene.waitFor(() => enemy.damageCount > damageCount);

                if (confirm(nomangle('Skip intro?'))) {
                    level = new GameplayLevel();
                }
            }
        })();
    }

    async repeat(msg, instruction, script, count) {
        for (let i = 0 ; i < count ; i++) {
            msg.text = instruction + ' (' + i + '/' + count + ')';
            await script();
        }
        
        msg.text = instruction + ' (' + count + '/' + count + ')';

        await this.scene.delay(1);
        msg.text = '';
        await this.scene.delay(1);
    }
}
