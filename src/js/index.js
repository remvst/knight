onload = () => {
    can = document.querySelector(nomangle('canvas'));
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

    onresize();
    frame();
};

let lastFrame = performance.now();

const level = new GameplayLevel();

frame = () => {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    // Game update
    level.cycle(elapsed);

    // Rendering
    ctx.wrap(() => level.scene.render());

    if (DEBUG) {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.textAlign = nomangle('left');
        ctx.textBaseline = nomangle('bottom');
        ctx.font = nomangle('14pt Courier');
        ctx.lineWidth = 3;

        let y = CANVAS_HEIGHT - 10;
        for (const line of [
            nomangle('FPS: ') + ~~(1 / elapsed),
            nomangle('Entities: ') + level.scene.entities.size,
        ].reverse()) {
            ctx.strokeText(line, 10, y);
            ctx.fillText(line, 10, y);
            y -= 20;
        }
    }

    requestAnimationFrame(frame);
}
