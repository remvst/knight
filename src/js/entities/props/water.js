class Water extends Entity {
    constructor() {
        super();
        this.categories.push('water');
        this.width = this.height = 0;
    }

    get z() { 
        return LAYER_WATER; 
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.renderPadding = max(this.width, this.height) / 2;
    }

    contains(point) {
        const xInSelf = point.x - this.x;
        const yInSelf = point.y - this.y;

        const xInSelfRotated = xInSelf * cos(this.rotation) + yInSelf * sin(this.rotation);
        const yInSelfRotated = -xInSelf * sin(this.rotation) + yInSelf * cos(this.rotation);

        return abs(xInSelfRotated) < this.width / 2 && abs(yInSelfRotated) < this.height / 2;
    }

    doRender() {
        this.rng.reset();

        wrap(() => {
            fillStyle = '#08a';
            translate(this.x, this.y);
            rotate(this.rotation);
            beginPath();
            rect(-this.width / 2, -this.height / 2, this.width, this.height);
            fill();
            clip();

            // Ripples
            rotate(-this.rotation);
            scale(1, 0.5);
            strokeStyle = '#fff';
            lineWidth = 4;

            for (let i = 3; i-- ; ) {
                const duration = 2;
                const relativeAge = (this.age + this.rng.next(0, 20)) / duration;
                const ratio = min(1, relativeAge % (duration / 2));

                globalAlpha = (1 - ratio) / 2;
                beginPath();
                arc(
                    ((this.rng.next(0, this.width) + ~~relativeAge * this.width * 0.7) % this.width) - this.width / 2,
                    ((this.rng.next(0, this.height) + ~~relativeAge * this.height * 0.7) % this.height) - this.width / 2,
                    ratio * this.rng.next(20, 60),
                    0,
                    TWO_PI,
                );
                stroke();
            }
        });
    }
}
