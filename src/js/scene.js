
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
