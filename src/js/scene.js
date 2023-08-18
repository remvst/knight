
class Scene {
    constructor() {
        this.entities = new Set();
        this.categories = new Map();

        this.add(new Camera());
    }

    add(entity) {
        this.entities.add(entity);
        entity.scene = this;

        for (const category of entity.categories) {
            if (!this.categories.has(category)) {
                this.categories.set(category, new Set([entity]));
            } else {
                this.categories.get(category).add(entity);
            }
        }
    }

    category(category) {
        return this.categories.get(category) || [];
    }

    remove(entity) {
        this.entities.delete(entity);

        for (const category of entity.categories) {
            if (this.categories.has(category)) {
                this.categories.get(category).delete(entity);
            }
        }
    }

    cycle(elapsed) {
        if (DEBUG && DOWN[70]) elapsed *= 3;
        if (DEBUG && DOWN[71]) elapsed *= 0.1;
        for (const entity of this.entities) {
            entity.cycle(elapsed);
        }
    }

    pathCurve(x) {
        const main = sin(x * TWO_PI / 2000) * 200;
        const wiggle = sin(x * TWO_PI / 1000) * 100;
        return main + wiggle;
    }

    render() {
        // Background
        ctx.fillStyle = '#996';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const camera = firstItem(this.category('camera'));
        
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.x, -camera.y);
        ctx.translate(CANVAS_WIDTH / 2 / camera.zoom, CANVAS_HEIGHT / 2 / camera.zoom);

        // Path
        ctx.strokeStyle = '#dc9';
        ctx.lineWidth = 70;

        ctx.beginPath();
        for (let x = roundToNearest(camera.x - CANVAS_WIDTH * 2, 300) ; x < camera.x + CANVAS_WIDTH ; x += 300) {
            const y = this.pathCurve(x);
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        const ordered = Array.from(this.entities).sort((a, b) => a.z - b.z);
        for (const entity of ordered) {
            ctx.wrap(() => entity.render());
        }
    }
}
