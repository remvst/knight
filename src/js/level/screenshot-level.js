class ScreenshotLevel extends Level {
    constructor() {
        super();

        oncontextmenu = () => {};

        const player = firstItem(this.scene.category('player'));
        player.age = 0.4;

        MOUSE_POSITION.x = Number.MAX_SAFE_INTEGER;
        MOUSE_POSITION.y = CANVAS_HEIGHT / 2;
        DOWN[39] = true;

        const camera = firstItem(this.scene.category('camera'));
        camera.zoom = 2;
        camera.cycle(99);

        this.scene.add(new Path());

        for (const entity of Array.from(this.scene.entities)) {
            if (entity instanceof Bush) entity.remove();
            if (entity instanceof Bird) entity.remove();
            if (entity instanceof Cursor) entity.remove();
        }

        const announcement = this.scene.add(new Announcement(nomangle('Path to Glory')));
        announcement.age = 1;

        const bird1 = this.scene.add(new Bird());
        bird1.x = player.x + 100;
        bird1.y = player.y - 200;

        const bird2 = this.scene.add(new Bird());
        bird2.x = player.x + 150;
        bird2.y = player.y - 150;

        const bird3 = this.scene.add(new Bird());
        bird3.x = player.x - 250;
        bird3.y = player.y + 50;

        const tree1 = this.scene.add(new Tree());
        tree1.x = player.x - 200;
        tree1.y = player.y - 50;

        const tree2 = this.scene.add(new Tree());
        tree2.x = player.x + 200;
        tree2.y = player.y - 150;

        const tree3 = this.scene.add(new Tree());
        tree3.x = player.x + 300;
        tree3.y = player.y + 150;

        const bush1 = this.scene.add(new Bush());
        bush1.x = player.x + 100;
        bush1.y = player.y - 50;

        const bush2 = this.scene.add(new Bush());
        bush2.x = player.x - 200;
        bush2.y = player.y + 50;

        const bush3 = this.scene.add(new Bush());
        bush3.x = player.x + 50;
        bush3.y = player.y - 200;

        const water1 = this.scene.add(new Water());
        water1.x = player.x - 100;
        water1.y = player.y - 350;
        water1.rotation = PI / 8;
        water1.width = 200;
        water1.height = 200;

        const water2 = this.scene.add(new Water());
        water2.x = player.x + 350;
        water2.y = player.y - 150;
        water2.rotation = PI / 8;
        water2.width = 200;
        water2.height = 200;

        const enemy1 = this.scene.add(new KingEnemy());
        enemy1.x = player.x + 180;
        enemy1.y = player.y - 30;
        enemy1.setController(new AI());
        enemy1.controls.aim.x = player.x;
        enemy1.controls.aim.y = player.y;
        enemy1.controls.attack = true;
        enemy1.cycle(0);
        enemy1.cycle(0.1);

        const enemy2 = this.scene.add(new AxeShieldTankEnemy());
        enemy2.x = player.x - 100;
        enemy2.y = player.y - 100;
        enemy2.setController(new AI());
        enemy2.controls.aim.x = player.x;
        enemy2.controls.aim.y = player.y;
        enemy2.controls.force = 1;
        enemy2.age = 0.6;
        enemy2.controls.angle = angleBetween(enemy2, player)

        this.cycle(0); // helps regen grass
    }
}
