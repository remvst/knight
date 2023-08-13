class Player extends Entity {
    constructor() {
        super();
        this.categories.push('player');

        this.controls = {
            'force': 0,
            'angle': 0,
        };
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        let x = 0, y = 0;
        if (DOWN[37]) x = -1;
        if (DOWN[38]) y = -1;
        if (DOWN[39]) x = 1;
        if (DOWN[40]) y = 1;

        this.controls.angle = atan2(y, x);
        this.controls.force = x || y ? 1 : 0;
        
        this.x += cos(this.controls.angle) * this.controls.force * 100 * elapsed;
        this.y += sin(this.controls.angle) * this.controls.force * 100 * elapsed;
    }
}
