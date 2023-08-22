class ShieldBlock extends Entity {

    get z() { 
        return LAYER_ANIMATIONS; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 0.25) {
            this.remove();
        }
    }

    doRender() {
        const ratio = this.age / 0.25;
        fillStyle = '#fff';

        translate(this.x, this.y);
        scale(ratio, ratio);

        globalAlpha = 1 - ratio; 
        strokeStyle = '#fff';
        lineWidth = 10;
        beginPath();
        arc(0, 0, 80, 0, TWO_PI);
        stroke();
    }
}
