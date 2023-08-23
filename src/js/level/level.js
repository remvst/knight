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
}
