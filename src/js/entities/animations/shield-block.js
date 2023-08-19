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

    render() {
        super.render();

        const ratio = this.age / 0.25;
        ctx.fillStyle = '#fff';

        ctx.translate(this.x, this.y);
        ctx.scale(ratio, ratio);

        ctx.globalAlpha = 1 - ratio; 
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, TWO_PI);
        ctx.stroke();
    }
}
