class IntroLevel extends Level {
    constructor() {
        super();

        const camera = firstItem(this.scene.category('camera'));
        camera.zoom = 2;

        const fade = this.scene.add(new Fade());
        this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 2, linear))
            .await()
            .then(() => fade.remove());

        // Spawn a few dummies
        for (let r = 0 ; r < 1 ; r += 0.1) {
            const enemy = new DummyEnemy();
            enemy.x = cos(r * TWO_PI) * 200;
            enemy.y = sin(r * TWO_PI) * 200;
            this.scene.add(enemy);
        }
    }
}
