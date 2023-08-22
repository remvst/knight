regenEntity = (entity, radiusX, radiusY, pathMinDist = 50) => {
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

    while (entity.y < camera.y - radiusY) {
        entity.y += radiusX * 2;
    } 
    
    while (entity.y > camera.y + radiusY) {
        entity.y -= radiusX * 2;
    }

    while (regen) {
        entity.y = entity.scene.pathCurve(entity.x) + rnd(pathMinDist, 500) * pick([-1, 1]);
        const distToPath = abs(entity.y - entity.scene.pathCurve(entity.x));
        regen = distToPath < pathMinDist || entity.inWater;
    }
};
