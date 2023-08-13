class Entity {
    constructor() {
        this.x = this.y = this.rotation = 0;   
        this.categories = [];
    }

    cycle(elapsed) {

    }

    render() {
        if (DEBUG) {
            ctx.fillStyle = '#f00';
            ctx.fillRect(this.x - 1, this.y - 5, 2, 10);
            ctx.fillRect(this.x - 5, this.y - 1, 10, 2);
        }
    }
}
