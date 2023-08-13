class Character extends Entity {
    constructor() {
        super();
        this.categories.push('character');

        this.facing = 1;

        this.attackStart = 0;
        this.attackStrike = 0;
        this.attackEnd = 0;

        this.controls = {
            'force': 0,
            'angle': 0,
            'shield': false,
            'attack': false,
        };
    }

    cycle(elapsed) {
        const ageBefore = this.age;

        super.cycle(elapsed);
        
        this.x += cos(this.controls.angle) * this.controls.force * 200 * elapsed;
        this.y += sin(this.controls.angle) * this.controls.force * 200 * elapsed;

        if (this.controls.force) this.facing = sign(cos(this.controls.angle)) || 1;

        if (this.controls.attack) {
            this.attack();
        }

        if (ageBefore <= this.attackStrike && this.age >= this.attackStrike) {
            this.strike();
        }
    }

    attack() {
        if (this.attackEnd <= this.age) {
            this.attackStart = this.age;
            this.attackStrike = this.age + 0.05;
            this.attackEnd = this.age + 0.2;
        }
    }

    strike() {
        console.log('TAKE DIS!');
    }
}
