onload = () => {
    can = document.querySelector(nomangle('canvas'));
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

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
    wrap(() => level.scene.render());

    if (DEBUG) {
        fillStyle = '#fff';
        strokeStyle = '#000';
        textAlign = nomangle('left');
        textBaseline = nomangle('bottom');
        font = nomangle('14pt Courier');
        lineWidth = 3;

        let y = CANVAS_HEIGHT - 10;
        for (const line of [
            nomangle('FPS: ') + ~~(1 / elapsed),
            nomangle('Entities: ') + level.scene.entities.size,
        ].reverse()) {
            strokeText(line, 10, y);
            fillText(line, 10, y);
            y -= 20;
        }
    }

    requestAnimationFrame(frame);
}
