regenEntity = (entity, radiusX) => {
    const camera = firstItem(entity.scene.category('camera'));
    let regen = false;
    while (entity.x < camera.x - radiusX) {
        entity.x += radiusX * 2;
        regen = true;
    } 
    
    while (entity.x > camera.x + radiusX) {
        entity.x -= radiusX * 2;
        regen = true;
    }

    while (regen) {
        entity.y = entity.scene.pathCurve(entity.x) + rnd(50, 500) * pick([-1, 1]);
        regen = entity.inWater;
    }
};
