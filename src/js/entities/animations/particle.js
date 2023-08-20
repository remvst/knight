class Particle extends Entity {

    constructor(
        color,
        valuesSize,
        valuesX,
        valuesY,
        duration,
    ) {
        super();
        this.color = color;
        this.valuesSize = valuesSize;
        this.valuesX = valuesX;
        this.valuesY = valuesY;
        this.duration = duration;
    }

    get z() { 
        return LAYER_PARTICLE; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > this.duration) {
            this.remove();
        }
    }

    interp(property) {
        const progress = this.age / this.duration;
        return property[0] + progress * (property[1] - property[0]);
    }

    doRender() {
        const size = this.interp(this.valuesSize);
        ctx.translate(this.interp(this.valuesX) - size / 2, this.interp(this.valuesY) - size / 2);
        ctx.rotate(PI / 4);

        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.interp([1, 0]);
        ctx.fillRect(0, 0, size, size);
    }
}
