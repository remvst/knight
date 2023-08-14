class Character extends Entity {
    constructor() {
        super();
        this.categories.push('character');

        this.facing = 1;

        this.shielding = false;

        this.attackPrepareStart = 0;
        this.attackPrepareEnd = 0;

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

        const attackingOrPreparingAttack = this.attackPrepareEnd || this.attackEnd > this.age;
        const speed = this.shielding || this.attackPrepareEnd || this.inWater ? 100 : 200;
        
        this.x += cos(this.controls.angle) * this.controls.force * speed * elapsed;
        this.y += sin(this.controls.angle) * this.controls.force * speed * elapsed;

        if (this.controls.force && abs(cos(this.controls.angle)) > 0.1) {
            this.facing = sign(cos(this.controls.angle)) || 1;
        }

        if (this.controls.attack && !attackingOrPreparingAttack && !this.shielding) {
            this.attackPrepareStart = this.age;
            this.attackPrepareEnd = this.age + 1;
        }

        if (!this.controls.attack && this.attackPrepareEnd > 0) {
            this.attack();
        }

        if (ageBefore <= this.attackStrike && this.age >= this.attackStrike) {
            this.strike();
        }

        this.shielding = this.controls.shield && !attackingOrPreparingAttack;
    }

    attack() {
        if (this.attackEnd <= this.age) {
            const { inWater } = this;
            this.attackStart = this.age;
            this.attackStrike = this.age + 0.05 * (inWater ? 2 : 1);
            this.attackEnd = this.age + 0.2 * (inWater ? 2 : 1);

            this.attackPrepareEnd = 0;
        }
    }

    strike() {
        console.log('TAKE DIS!');
    }
}
