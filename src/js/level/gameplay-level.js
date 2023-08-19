class GameplayLevel extends Level {
    constructor() {
        super();

        // Spawn a few dummies
        for (let r = 0 ; r < 1 ; r += 0.1) {
            const enemy = new DummyEnemy();
            enemy.x = cos(r * TWO_PI) * 200;
            enemy.y = sin(r * TWO_PI) * 200;
            this.scene.add(enemy);
        }

        let y = 0;
        for (const type of [
            StickEnemy,
            StickAndShirtEnemy,
            SwordEnemy,
            SwordAndShieldEnemy,
            SwordAndArmorEnemy,
            TankEnemy,
        ]) {
            const enemy = this.scene.add(new type());;
            enemy.x = 200;
            enemy.y = y;

            this.scene.add(new CharacterHUD(enemy));

            y += 100;
            break;
        }
    }
}
