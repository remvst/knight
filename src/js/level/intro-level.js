class IntroLevel extends Level {
    constructor() {
        super();

        const camera = firstItem(this.scene.category('camera'));
        camera.zoom = 2;

        const player = firstItem(this.scene.category('player'));

        camera.cycle(99);

        const dummy = this.scene.add(new DummyEnemy());
        dummy.x = 200;

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

            // Attack tutorial
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
            await this.repeat(
                msg,
                nomangle('Hold SHIFT to raise your shield'),
                async () => {
                    await this.waitFor(() => !player.stateMachine.state.shielded);
                    await this.waitFor(() => player.stateMachine.state.shielded && player.stateMachine.state.age > 0.2);
                },
                3,
            );

            // Roll tutorial
            await this.repeat(
                msg,
                nomangle('Press SPACE to roll'),
                async () => {
                    await this.waitFor(() => player.stateMachine.state.dashAngle);
                    await this.waitFor(() => !player.stateMachine.state.dashAngle);
                },
                3,
            );

            msg.text = '';
            await this.delay(1);

            await this.scene.add(new Interpolator(fade, 'alpha', 0, 1, 2)).await();
            msg.text = nomangle('Tutorial DONE!');
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
