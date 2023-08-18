class Interpolator extends Entity {

    constructor(
        object,
        property,
        fromValue,
        toValue,
        duration,
        easing = linear,
    ) {
        super();
        this.object = object;
        this.property = property;
        this.fromValue = fromValue;
        this.toValue = toValue;
        this.duration = duration;
        this.easing = easing;

        this.cycle(0);
    }

    await() {
        return new Promise(resolve => this.resolve = resolve);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const progress = this.age / this.duration;
        if (progress > 1) {
            this.remove();
            if (this.resolve) this.resolve();
            return;
        }

        this.object[this.property] = interpolate(this.fromValue, this.toValue, this.easing(progress));
    }
}

removeObjectWhenDone = interpolator => interpolator.object.remove();
