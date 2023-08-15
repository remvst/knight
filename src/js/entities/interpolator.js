class Interpolator extends Entity {

    constructor(
        object,
        property,
        fromValue,
        toValue,
        duration,
    ) {
        super();
        this.object = object;
        this.property = property;
        this.fromValue = fromValue;
        this.toValue = toValue;
        this.duration = duration;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const progress = this.age / this.duration;
        if (progress > 1) {
            this.remove();
            return;
        }

        this.object[this.property] = progress * (this.toValue - this.fromValue) + this.fromValue;
    }
}
