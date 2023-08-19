class IntroLevel extends Level {
    constructor() {
        super();

        const camera = firstItem(this.scene.category('camera'));
        camera.zoom = 2;

        const player = firstItem(this.scene.category('player'));

        camera.cycle(99);

        // Spawn a few dummies
        const dummies = [];
        for (let r = 0 ; r < 1 ; r += 0.1) {
            const enemy = this.scene.add(new DummyEnemy());
            enemy.x = cos(r * TWO_PI) * 200;
            enemy.y = sin(r * TWO_PI) * 200;
            dummies.push(enemy);
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

            // Attack tutorial
            msg.text = nomangle('Click to strike the dummy');
            await this.waitFor(() => {
                for (const dummy of dummies) {
                    if (dummy.health <= 0) return true;
                }
            });

            // Charge tutorial
            msg.text = nomangle('Hold your click to charge a heavy attack');
            await this.waitFor(() => player.stateMachine.state.attackPreparationRatio >= 1);
            msg.text = nomangle('Nice');

            // Shield tutorial 
            // TODO add an enemy to shield against
            msg.text = nomangle('Hold SHIFT to raise your shield');
            await this.waitFor(() => player.stateMachine.state.shielded && player.stateMachine.state.age > 0.5);

            // Roll tutorial
            msg.text = nomangle('Press SPACE to roll');
            await this.waitFor(() => player.stateMachine.state.dashAngle);

            await this.scene.add(new Interpolator(fade, 'alpha', 0, 1, 2)).await();
            msg.text = nomangle('Tutorial DONE!');
        })();
    }
}
