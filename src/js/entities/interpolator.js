class Interpolator extends Entity {

    constructor(
        object,
        property,
        fromValue,
        toValue,
        duration,
        easing = (x) => x,
    ) {
        super();
        this.object = object;
        this.property = property;
        this.fromValue = fromValue;
        this.toValue = toValue;
        this.duration = duration;
        this.easing = easing;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const progress = this.age / this.duration;
        if (progress > 1) {
            this.remove();
            return;
        }

        this.object[this.property] = interpolate(this.fromValue, this.toValue, this.easing(progress));
    }
}
