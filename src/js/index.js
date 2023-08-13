onload = () => {
    can = document.querySelector(nomangle('canvas'));
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

    onresize();
    frame();
};

let lastFrame = performance.now();

class Entity {

}

class Camera {
    constructor() {
        this.centerX = 0;
        this.centerY = 0;
        this.zoom = 1;
    }
}

class Scene {
    constructor() {
        this.camera = new Camera();
        this.entities = new Set();
    }

    add(entity) {
        this.entities.add(entity);
        entity.scene = this;
    }

    remove(entity) {
        this.entities.delete(entity);
    }

    cycle(elapsed) {

    }

    render() {

    }
}

const player = new Entity();

const scene = new Scene();
scene.add(player);

frame = () => {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    // Game update
    scene.cycle(elapsed);

    // Rendering
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    scene.camera.centerX += elapsed * 10;

    ctx.wrap(() => {
        const { camera } = scene;
        ctx.imageSmoothingEnabled = false;
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.centerX, -camera.centerY);
        ctx.translate(CANVAS_WIDTH / 2 / camera.zoom, CANVAS_HEIGHT / 2 / camera.zoom);

        if (DEBUG) {
            const CELL_SIZE = 10;
            ctx.wrap(() => {
                ctx.fillStyle = '#f00';
                ctx.globalAlpha = 0.25;
                for (let x = roundToNearest(camera.centerX - CANVAS_WIDTH / 2, CELL_SIZE) ; x < roundToNearest(camera.centerX + CANVAS_WIDTH / 2, CELL_SIZE) ; x += CELL_SIZE) {
                    ctx.fillRect(x - 0.5, camera.centerY - CANVAS_HEIGHT / 2, 1, CANVAS_HEIGHT);
                }
                for (let y = roundToNearest(camera.centerY - CANVAS_HEIGHT / 2, CELL_SIZE) ; y < roundToNearest(camera.centerY + CANVAS_HEIGHT / 2, CELL_SIZE) ; y += CELL_SIZE) {
                    ctx.fillRect(camera.centerX - CANVAS_WIDTH / 2, y - 0.5, CANVAS_WIDTH, 1);
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
