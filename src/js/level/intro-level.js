class IntroLevel extends Level {
    constructor() {
        super();

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

        (async () => {
            const fade = this.scene.add(new Fade());

            const logo = this.scene.add(new Logo());
            logo.x = player.x;
            logo.y = player.y - CANVAS_HEIGHT / 3;

            await this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 2)).await();

            const msg = this.scene.add(new Instruction());

            // Movement tutorial
            msg.text = nomangle('Use arrow keys or WASD to move');
            await this.waitFor(() => distP(player.x, player.y, 0, 0) > 50);
            await this.scene.add(new Interpolator(logo, 'alpha', 1, 0, 2)).await();
            logo.remove();

            msg.text = '';
            await this.delay(1);

            // Roll tutorial
            await this.repeat(
                msg,
                nomangle('Press SPACE to roll'),
                async () => {
                    await this.waitFor(() => player.stateMachine.state.dashAngle !== undefined);
                    await this.waitFor(() => player.stateMachine.state.dashAngle === undefined);
                },
                3,
            );

            // Attack tutorial
            const dummy = this.scene.add(new DummyEnemy());
            dummy.x = player.x + 200;
            dummy.y = player.y;
            dummy.poof();

            await this.repeat(
                msg,
                nomangle('CLICK to strike the dummy'),
                async () => {
                    const initial = dummy.damageCount;
                    await this.waitFor(() => dummy.damageCount > initial);
                },
                10,
            );

            // Charge tutorial
            await this.repeat(
                msg,
                nomangle('Hold CLICK to charge a heavy attack'),
                async () => {
                    await this.waitFor(() => player.stateMachine.state.attackPreparationRatio >= 1);

                    const initial = dummy.damageCount;
                    await this.waitFor(() => dummy.damageCount > initial);
                },
                3,
            );

            // Shield tutorial 
            // TODO add an enemy to shield against

            const enemy = this.scene.add(new StickEnemy());
            enemy.x = camera.x + CANVAS_WIDTH / 2 / camera.zoom + 20;
            enemy.damageRatio = 0;
            enemy.setController(new AttackAI());

            await this.repeat(
                msg,
                nomangle('Hold SHIFT to block attacks'),
                async () => {
                    const initial = player.parryCount;
                    await this.waitFor(() => player.parryCount > initial);
                },
                3,
            );

            msg.text = '';
            await this.delay(1);

            msg.text = nomangle('You are ready for your glorious quest');
            await this.scene.add(new Interpolator(fade, 'alpha', 0, 1, 2)).await();
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
