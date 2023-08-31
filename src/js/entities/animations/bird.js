class Bird extends Entity {
    constructor() {
        super();
        this.regen();
    }

    get z() { 
        return LAYER_WEATHER;
    }

    regen() {
        this.age = 0;

        let cameraX = 0, cameraY = 0;
        if (this.scene) {
            const camera = firstItem(this.scene.category('camera'));
            cameraX = camera.x;
            cameraY = camera.y;
        }
        this.x = rnd(cameraX - evaluate(CANVAS_WIDTH / 2), cameraX + evaluate(CANVAS_WIDTH / 2));
        this.y = cameraY - evaluate(CANVAS_HEIGHT / 2 + 100);
        this.rotation = rnd(PI / 4, PI * 3 / 4);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const camera = firstItem(this.scene.category('camera'));
        if (this.y > camera.y + evaluate(CANVAS_HEIGHT / 2 + 300)) {
            this.regen();
        }

        this.x += cos(this.rotation) * elapsed * 300;
        this.y += sin(this.rotation) * elapsed * 300;
    }

    doRender() {
        ctx.translate(this.x, this.y + 300);

        ctx.withShadow(() => {
            ctx.strokeStyle = ctx.resolveColor('#000');
            ctx.lineWidth = 4;
            ctx.beginPath();

            ctx.translate(0, -300);

            const angle = sin(this.age * TWO_PI * 4) * PI / 16 + PI / 4;

            ctx.lineTo(-cos(angle) * 10, -sin(angle) * 10);
            ctx.lineTo(0, 0);
            ctx.lineTo(cos(angle) * 10, -sin(angle) * 10);
            ctx.stroke();
        });
    }
}
