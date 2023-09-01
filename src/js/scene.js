
class Scene {
    constructor() {
        this.entities = new Set();
        this.categories = new Map();
        this.sortedEntities = [];

        this.speedRatio = 1;
        this.onCycle = new Set();
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

        for (const onCycle of this.onCycle) {
            onCycle();
        }
    }

    pathCurve(x) {
        const main = sin(x * TWO_PI / 2000) * 200;
        const wiggle = sin(x * TWO_PI / 1000) * 100;
        return main + wiggle;
    }

    render() {
        const camera = firstItem(this.category('camera'));

        // Background
        ctx.fillStyle = '#996';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Thunder
        if (camera.age % THUNDER_INTERVAL < 0.3 && camera.age % 0.2 < 0.1) {
            ctx.wrap(() => {
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            });
        }
        
        ctx.wrap(() => {
            ctx.scale(camera.appliedZoom, camera.appliedZoom);
            ctx.translate(
                CANVAS_WIDTH / 2 / camera.appliedZoom - camera.x, 
                CANVAS_HEIGHT / 2 / camera.appliedZoom - camera.y,
            );

            this.sortedEntities.sort((a, b) => a.z - b.z);

            for (const entity of this.sortedEntities) {
                ctx.wrap(() => entity.render());
            }
        });
    }

    async waitFor(condition) {
        return new Promise((resolve) => {
            const checker = () => {
                if (condition()) {
                    this.onCycle.delete(checker);
                    resolve();
                }
            };
            this.onCycle.add(checker);
        })
    }

    async delay(timeout) {
        const entity = this.add(new Entity());
        await this.waitFor(() => entity.age > timeout);
        entity.remove();
    }
}
