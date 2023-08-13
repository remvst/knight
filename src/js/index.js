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
scene.add(new Player());

frame = () => {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    // Game update
    scene.cycle(elapsed);

    // Rendering
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const camera = firstItem(scene.category('camera'));

    ctx.wrap(() => {
        ctx.imageSmoothingEnabled = false;
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.x, -camera.y);
        ctx.translate(CANVAS_WIDTH / 2 / camera.zoom, CANVAS_HEIGHT / 2 / camera.zoom);

        if (DEBUG) {
            const CELL_SIZE = 10;
            ctx.wrap(() => {
                ctx.fillStyle = '#f00';
                ctx.globalAlpha = 0.25;
                for (let x = roundToNearest(camera.x - CANVAS_WIDTH / 2, CELL_SIZE) ; x < roundToNearest(camera.x + CANVAS_WIDTH / 2, CELL_SIZE) ; x += CELL_SIZE) {
                    ctx.fillRect(x - 0.5, camera.y - CANVAS_HEIGHT / 2, 1, CANVAS_HEIGHT);
                }
                for (let y = roundToNearest(camera.y - CANVAS_HEIGHT / 2, CELL_SIZE) ; y < roundToNearest(camera.y + CANVAS_HEIGHT / 2, CELL_SIZE) ; y += CELL_SIZE) {
                    ctx.fillRect(camera.x - CANVAS_WIDTH / 2, y - 0.5, CANVAS_WIDTH, 1);
                }
            });
        }   

        scene.render();
    });

    if (DEBUG) {
        ctx.fillStyle = '#fff';
        ctx.textAlign = nomangle('right');
        ctx.textBaseline = nomangle('top');
        ctx.font = nomangle('24pt Arial');
        ctx.fillText(~~(1 / elapsed), CANVAS_WIDTH - 10, 10);
    }

    requestAnimationFrame(frame);
}
