
class Scene {
    constructor() {
        this.entities = new Set();
        this.categories = new Map();
        this.sortedEntities = [];

        this.speedRatio = 1;
    }

    add(entity) {
        if (this.entities.has(entity)) return;
        this.entities.add(entity);
        entity.scene = this;

        this.sortedEntities.push(entity);

        for (const category of entity.categories) {
            if (!this.categories.has(category)) {
                this.categories.set(category, new Set([entity]));
            } else {
                this.categories.get(category).add(entity);
            }
        }

        return entity;
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

        const index = this.sortedEntities.indexOf(entity);
        if (index >= 0) this.sortedEntities.splice(index, 1);
    }

    cycle(elapsed) {
        if (DEBUG && DOWN[70]) elapsed *= 3;
        if (DEBUG && DOWN[71]) elapsed *= 0.1;
        if (GAME_PAUSED) return;

        for (const entity of this.entities) {
            entity.cycle(elapsed * (entity.affectedBySpeedRatio ? this.speedRatio : 1));
        }
    }

    pathCurve(x) {
        const main = sin(x * TWO_PI / 2000) * 200;
        const wiggle = sin(x * TWO_PI / 1000) * 100;
        return main + wiggle;
    }

    render() {
        // Background
        ctx.wrap(() => {
            // ctx.globalAlpha = this.speedRatio;
            ctx.fillStyle = '#996';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        });

        // if (this.speedRatio < 1) {
            // ctx.wrap(() => {
            //     ctx.globalCompositeOperation = 'destination-out';

            //     const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 400);
            //     // grad.addColorStop(0, 'rgba(255,255,255,0)');
            //     // grad.addColorStop(1, 'rgba(255,255,255,0.5)');
            //     grad.addColorStop(0, 'rgba(255,255,255,1)');
            //     grad.addColorStop(1, 'rgba(255,255,255,0)');

            //     ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            //     ctx.fillStyle = grad;
            //     ctx.fillRect(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);
            // });
        // }

        const camera = firstItem(this.category('camera'));
        
        ctx.wrap(() => {
            ctx.scale(camera.zoom, camera.zoom);
            ctx.translate(-camera.x, -camera.y);
            ctx.translate(CANVAS_WIDTH / 2 / camera.zoom, CANVAS_HEIGHT / 2 / camera.zoom);

            this.sortedEntities.sort((a, b) => a.z - b.z);

            for (const entity of this.sortedEntities) {
                ctx.wrap(() => entity.render());
            }
        });
    }
}
