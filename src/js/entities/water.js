class Water extends Entity {
    constructor() {
        super();
        this.categories.push('water');
        this.width = this.height = 0;
    }

    get z() { return Number.MIN_SAFE_INTEGER; }

    cycle(elapsed) {
        for (const character of this.scene.category('character')) {
            // console.log('contained?', this.contains(character));
        }
    }

    contains(point) {
        const xInSelf = point.x - this.x;
        const yInSelf = point.y - this.y;

        const xInSelfRotated = xInSelf * cos(this.rotation) + yInSelf * sin(this.rotation);
        const yInSelfRotated = -xInSelf * sin(this.rotation) + yInSelf * cos(this.rotation);

        return abs(xInSelfRotated) < this.width / 2 && abs(yInSelfRotated) < this.height / 2;
    }

    render() {
        ctx.wrap(() => {
            ctx.fillStyle = '#08a';
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        });
    }
}
