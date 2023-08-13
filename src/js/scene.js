
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
        for (const entity of this.entities) {
            entity.cycle(elapsed);
        }
    }

    render() {
        for (const entity of this.entities) {
            entity.render();
        }
    }
}
