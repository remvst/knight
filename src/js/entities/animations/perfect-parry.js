class PerfectParry extends Entity {

    constructor() {
        super();
        this.affectedBySpeedRatio = false;
    }

    get z() { 
        return LAYER_ANIMATIONS; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 0.5) {
            this.remove();
        }
    }

    doRender() {
        const ratio = this.age / 0.5;
        fillStyle = '#fff';

        translate(this.x, this.y);

        globalAlpha = (1 - ratio); 
        strokeStyle = '#fff';
        fillStyle = '#fff';
        lineWidth = 20;
        beginPath();

        for (let r = 0 ; r < 1 ; r+= 0.05) {
            const angle = r * TWO_PI;
            const radius = ratio * rnd(140, 200);
            lineTo(
                cos(angle) * radius,
                sin(angle) * radius,
            );
        }

        fill();
    }
}
