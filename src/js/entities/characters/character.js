class Character extends Entity {
    constructor() {
        super();
        this.categories.push('character');

        this.facing = 1;

        this.health = 1;

        this.stamina = 1;
        this.lastStaminaLoss = 0;

        this.shielding = false;
        this.shieldingStart = 0;

        this.timeToPrepareHeavyAttack = 1;
        this.timeToStrike = 0.05;
        this.timeToCooldown = 0.1;

        this.attackPrepareStart = 0;
        this.attackPrepareEnd = 0;

        this.strikePowerRatio = 1;
        this.attackStart = 0;
        this.attackStrike = 0;
        this.attackEnd = 0;

        this.strikeRadiusX = 80;
        this.strikeRadiusY = 40;

        this.collisionRadius = 30;

        this.lastDamage = 0;

        this.controller = null; // TODO remove

        this.controls = {
            'force': 0,
            'angle': 0,
            'shield': false,
            'attack': false,
        };
    }

    getColor(color) {
        return this.age - this.lastDamage < 0.1 ? '#fff' : color;
    }

    cycle(elapsed) {
        const ageBefore = this.age;
        const shieldingBefore = this.shielding;

        super.cycle(elapsed);

        this.controller.cycle(elapsed);

        if (this.inWater) {
            this.loseStamina(elapsed * 0.2);
        }

        const attackingOrPreparingAttack = this.attackPrepareEnd || this.attackEnd > this.age;
        const speed = this.shielding || this.attackPrepareEnd || this.inWater || this.exhausted ? 100 : 200;
        
        this.x += cos(this.controls.angle) * this.controls.force * speed * elapsed;
        this.y += sin(this.controls.angle) * this.controls.force * speed * elapsed;

        for (const character of this.scene.category('character')) {
            if (character === this) continue;
            if (dist(this, character) > this.collisionRadius) continue;
            const angle = angleBetween(this, character);
            this.x = character.x - cos(angle) * this.collisionRadius;
            this.y = character.y - sin(angle) * this.collisionRadius;
        }

        if (this.controls.attack && !attackingOrPreparingAttack && !this.shielding && !this.exhausted) {
            this.attackPrepareStart = this.age;
            this.attackPrepareEnd = this.age + this.timeToPrepareHeavyAttack;
        }

        if (!this.controls.attack && this.attackPrepareEnd > 0) {
            this.attack();
        }

        if (ageBefore <= this.attackStrike && this.age >= this.attackStrike) {
            this.strike();
        }

        this.shielding = this.controls.shield && !attackingOrPreparingAttack && !this.exhausted;
        if (this.shielding && !shieldingBefore) {
            this.shieldingStart = this.age;
        }

        if (this.age - this.lastStaminaLoss > 2) {
            this.stamina = min(1, this.stamina + elapsed * 0.3);
            if (this.stamina >= 1) {
                this.exhausted = false;
            }
        }
    }

    isWithinStrikeRadius(character) {
        return abs(character.x - this.x) < this.strikeRadiusX && 
            abs(character.y - this.y) < this.strikeRadiusY;
    }

    attack() {
        if (this.attackEnd <= this.age) {
            const { inWater } = this;
            this.attackStart = this.age;
            this.attackStrike = this.age + this.timeToStrike * (inWater ? 2 : 1);
            this.attackEnd = this.age + this.timeToCooldown * (inWater ? 2 : 1);

            const power = this.age >= this.attackPrepareEnd ? 3 : 1;
            this.strikePowerRatio = power;

            this.attackPrepareEnd = 0;

            this.loseStamina(power * 0.15);
        }
    }

    strike() {
        const victim = Array
            .from(this.scene.category('character'))
            .filter(character => character !== this && this.isWithinStrikeRadius(character))[0]

        const damage = 0.15 * this.strikePowerRatio;

        if (victim) {
            const angle = atan2(victim.y - this.y, victim.x - this.x);
            if (victim.shielding) {
                victim.facing = sign(this.x - victim.x) || 1;

                this.x -= cos(angle) * damage * 10;
                this.y -= sin(angle) * damage * 10;

                const shieldingTime = victim.age - victim.shieldingStart;
                if (shieldingTime < 0.1) {
                    // Perfect parry, victim gets stamina back, we lose ours
                    victim.stamina = 1;
                    this.loseStamina(1);

                    const camera = firstItem(this.scene.category('camera'));
                    // camera.zoom = 2;

                    // this.scene.add(new Interpolator(camera, 'zoom', camera.zoom, 2, 0.2));
                } else {
                    // Regular parry, victim loses stamina
                    victim.loseStamina(0.3);
                }
                
                const block = new ShieldBlock();
                block.x = victim.x + victim.facing * 20;
                block.y = victim.y - 30;
                this.scene.add(block);
            } else {
                victim.damage(damage);

                victim.x += cos(angle) * damage * 10;
                victim.y += sin(angle) * damage * 10;
            }
        }
    }

    loseStamina(amount) {
        this.stamina = max(0, this.stamina - amount);
        this.lastStaminaLoss = this.age;

        if (this.stamina <= 0) {
            this.exhausted = true;
        }
    }

    damage(amount) {
        this.health = max(0, this.health - amount);
        this.lastDamage = this.age;

        this.loseStamina(amount * 0.3);

        // Death
        if (this.health <= 0) this.remove();
    }

    render() {
        super.render();

        if (DEBUG) {
            // ctx.lineWidth = 1;
            // ctx.strokeStyle = '#f00';
            // ctx.beginPath();
            // ctx.ellipse(this.x, this.y, this.strikeRadiusX, this.strikeRadiusY, 0, 0, TWO_PI);
            // ctx.stroke();
        }
    }
}
