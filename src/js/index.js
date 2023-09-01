onload = () => {
    can = document.querySelector(nomangle('canvas'));
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

    // if (inputMode == INPUT_MODE_TOUCH) {
    //     can.width *= 0.5;
    //     can.height *= 0.5;
    //     ctx.scale(0.5, 0.5);
    // }

    onresize();
    frame();
};

let lastFrame = performance.now();

const level = new IntroLevel();

frame = () => {
    const current = performance.now();
    const elapsed = (current - lastFrame) / 1000;
    lastFrame = current;

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
