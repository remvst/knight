class Level {
    constructor() {
        this.scene = new Scene();

        this.scene.add(new Camera());

        DOWN = {};
        MOUSE_DOWN = MOUSE_RIGHT_DOWN = false;

        this.scene.add(new AggressivityTracker());

        const player = this.scene.add(new Player());
        this.scene.add(new Cursor(player));

        this.scene.add(new Rain());
        this.scene.add(new PauseOverlay());

        for (let i = 2 ; i-- ; ) this.scene.add(new Bird());

        for (let i = 0 ; i < 400 ; i++) {
            const grass = new Grass();
            grass.x = rnd(-2, 2) * CANVAS_WIDTH;
            grass.y = rnd(-2, 2) * CANVAS_HEIGHT;
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

    async respawn(x, y) {
        const fade = this.scene.add(new Fade());
        await this.scene.add(new Interpolator(fade, 'alpha', 0, 1, 1)).await();
        const player = firstItem(this.scene.category('player'));
        const camera = firstItem(this.scene.category('camera'));
        player.x = x;
        player.y = y;
        camera.cycle(999);
        await this.scene.add(new Interpolator(fade, 'alpha', 1, 0, 1)).await();
        fade.remove();
    }
}
