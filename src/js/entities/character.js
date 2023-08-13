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

    get inWater() {
        for (const water of this.scene.category('water')) {
            if (water.contains(this)) return true;
        }
        return false;
    }

    cycle(elapsed) {
        const ageBefore = this.age;

        super.cycle(elapsed);

        const speed = this.inWater ? 100 : 200;
        
        this.x += cos(this.controls.angle) * this.controls.force * speed * elapsed;
        this.y += sin(this.controls.angle) * this.controls.force * speed * elapsed;

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
            const { inWater } = this;
            this.attackStart = this.age;
            this.attackStrike = this.age + 0.05 * (inWater ? 2 : 1);
            this.attackEnd = this.age + 0.2 * (inWater ? 2 : 1);
        }
    }

    strike() {
        console.log('TAKE DIS!');
    }
}
