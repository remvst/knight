class Level {
    constructor() {
        this.scene = new Scene();

        const camera = this.scene.add(new Camera());

        const player = this.scene.add(new Player());
        this.scene.add(new Cursor(player));

        this.scene.add(new Rain());
        this.scene.add(new PauseOverlay());

        // const fade = this.scene.add(new Fade());
        // this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 2, linear))
        //     .await()
        //     .then(() => fade.remove());

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
            const bush = new Bush();
            bush.x = random() * 10000;
            this.scene.add(bush);
        }
    }

    cycle(elapsed) {
        this.scene.cycle(elapsed);
    }
}
