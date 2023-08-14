class Obstacle extends Entity {

    constructor() {
        super();
        this.categories.push('obstacle');
        this.radius = 0;
    }

    cycle(elapsed) {
        super.cycle(elapsed);


        for (const character of this.scene.category('character')) {
            if (dist(character, this) < this.radius) {
                const angle = atan2(character.y - this.y, character.x - this.x);
                character.x = this.x + cos(angle) * this.radius;
                character.y = this.y + sin(angle) * this.radius;
            }
        }
    }
}
