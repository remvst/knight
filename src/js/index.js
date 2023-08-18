onload = () => {
    can = document.querySelector(nomangle('canvas'));
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

    onresize();
    frame();
};

let lastFrame = performance.now();

const scene = new Scene();

const player = new Player();
scene.add(player);
scene.add(new PlayerHUD(player));
scene.add(new Cursor(player));

// for (let r = 0 ; r < 1 ; r += 0.1) {
//     const enemy = new SwordAndShieldEnemy();
//     enemy.x = cos(r * TWO_PI) * 200;
//     enemy.y = sin(r * TWO_PI) * 200;
//     scene.add(enemy);
// }

let y = 0;
for (const type of [
    StickEnemy,
    SwordEnemy,
    SwordAndShieldEnemy,
    TankEnemy,
]) {
    const enemy = new type();
    enemy.x = 200;
    enemy.y = y;
    scene.add(enemy);

    y += 100;
}

for (let i = 0 ; i < 0 ; i++) {
    const enemy = new TankEnemy();
    enemy.x = rnd(-600, 600);
    enemy.y = rnd(-600, 600);
    scene.add(enemy);

    scene.add(new CharacterHUD(enemy));
}

for (let i = 0 ; i < 0 ; i++) {
    const enemy = new SwordAndShieldEnemy();
    enemy.x = rnd(-600, 600);
    enemy.y = rnd(-600, 600);
    scene.add(enemy);

    scene.add(new CharacterHUD(enemy));
}

for (let i = 0 ; i < 400 ; i++) {
    const grass = new Grass();
    grass.x = random() * 10000;
    scene.add(grass);
}

for (let i = 0 ; i < 20 ; i++) {
    const tree = new Tree();
    tree.x = random() * 10000;
    scene.add(tree);
}

for (let i = 0 ; i < 20 ; i++) {
    const bush = new Bush();
    bush.x = random() * 10000;
    scene.add(bush);
}

for (let x = 0 ; x < 10000 ; x += 300) {
    const water = new Water();
    water.width = rnd(100, 200);
    water.height = rnd(200, 400);
    water.rotation = random() * TWO_PI;
    water.x = x;
    water.y = scene.pathCurve(water.x) + rnd(300, 800) * pick([-1, 1]);
    scene.add(water);
}

const water = new Water();
water.rotation = PI / 3;
scene.add(water);

frame = () => {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    // Game update
    scene.cycle(elapsed);

    // Rendering
    ctx.wrap(() => scene.render());

    if (DEBUG) {
        ctx.fillStyle = '#fff';
        ctx.textAlign = nomangle('right');
        ctx.textBaseline = nomangle('top');
        ctx.font = nomangle('24pt Arial');
        ctx.fillText(~~(1 / elapsed), CANVAS_WIDTH - 10, 10);
    }

    requestAnimationFrame(frame);
}
