class Character extends Entity {
    constructor() {
        super();
        this.categories.push('character');

        this.facing = 1;

        this.health = 1;

        this.combo = 0;
        this.lastComboChange = 0;
        this.lastComboChangeReason = '';

        this.stamina = 1;
        this.lastStaminaLoss = 0;

        this.baseSpeed = 200;

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

        this.dashStart = 0;
        this.dashEnd = 0;

        this.controller = null; // TODO remove

        this.controls = {
            'force': 0,
            'angle': 0,
            'shield': false,
            'attack': false,
            'aim': {'x': 0, 'y': 0},
            'dash': false,
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
        const speed = (this.shielding || this.attackPrepareEnd || this.inWater || this.exhausted ? 0.5 : 1) * this.baseSpeed;
        const dashing = this.dashEnd > this.age;
        
        this.x += cos(this.controls.angle) * this.controls.force * speed * elapsed;
        this.y += sin(this.controls.angle) * this.controls.force * speed * elapsed;

        this.facing = sign(this.controls.aim.x - this.x) || 1;

        // Collisions with other characters
        for (const character of this.scene.category('character')) {
            if (character === this) continue;
            if (dist(this, character) > this.collisionRadius) continue;
            const angle = angleBetween(this, character);
            this.x = character.x - cos(angle) * this.collisionRadius;
            this.y = character.y - sin(angle) * this.collisionRadius;
        }

        // Attack
        if (this.controls.attack && !attackingOrPreparingAttack && !this.shielding && !this.exhausted && !dashing) {
            this.attackPrepareStart = this.age;
            this.attackPrepareEnd = this.age + this.timeToPrepareHeavyAttack;
        }

        if (!this.controls.attack && this.attackPrepareEnd > 0) {
            this.attack();
        }

        if (ageBefore <= this.attackStrike && this.age >= this.attackStrike) {
            this.strike();
        }

        // Shield
        this.shielding = this.controls.shield && !attackingOrPreparingAttack && !this.exhausted;
        if (this.shielding && !shieldingBefore && !dashing) {
            this.shieldingStart = this.age;
        }

        // Stamina regen
        if (this.age - this.lastStaminaLoss > 2) {
            this.stamina = min(1, this.stamina + elapsed * 0.3);
            if (this.stamina >= 1) {
                this.exhausted = false;
            }
        }

        // Combo reset
        if (this.age - this.lastComboChange > 5) {
            this.updateCombo(-99999, '');
        }

        // Dash
        if (this.controls.dash) {
            if (!this.waitingForDashRelease && !dashing) {
                this.dash();
            }
        } else {
            this.waitingForDashRelease = false;
        }

        if (dashing) {
            for (let i = 0 ; i < 3 ; i++) {
                const x = this.x + rnd(-5, 5);
                const y = this.y + rnd(-5, 5);
    
                this.scene.add(new Particle(
                    '#eee',
                    [5, 10],
                    [x, x + rnd(-20, 20)],
                    [y, y + rnd(-20, 20)],
                    rnd(0.5, 1),
                ));
            }
        }
    }

    updateCombo(value, reason) {
        this.combo = max(0, this.combo + value);
        this.lastComboChange = this.age;
        this.lastComboChangeReason = reason.toUpperCase();
    }

    isStrikable(character) {
        if (character === this) return false;

        const angle = angleBetween(this, character);
        const aimAngle = angleBetween(this, this.controls.aim);
        if (abs(normalize(aimAngle - angle)) > PI / 4) {
            return false;
        }

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

            // this.loseStamina(power * 0.05);
        }
    }

    strike() {
        const victims = Array
            .from(this.scene.category(this.targetTeam))
            .filter(character => character !== this && this.isStrikable(character));

        const damage = 0.15 * this.strikePowerRatio;

        for (const victim of victims) {
            const angle = atan2(victim.y - this.y, victim.x - this.x);
            if (victim.shielding) {
                victim.facing = sign(this.x - victim.x) || 1;

                this.x -= cos(angle) * damage * 10;
                this.y -= sin(angle) * damage * 10;

                let animation;
                let pushBack;

                const shieldingTime = victim.age - victim.shieldingStart;
                if (shieldingTime < 0.1) {
                    // Perfect parry, victim gets stamina back, we lose ours
                    victim.stamina = 1;
                    victim.updateCombo(1, nomangle('Perfect Parry!'));
                    this.loseStamina(1);

                    animation = new PerfectParry();
                    pushBack = 100;
                } else {
                    // Regular parry, victim loses stamina
                    victim.loseStamina(0.3);

                    victim.updateCombo(1, nomangle('Parry'));
                
                    animation = new ShieldBlock();
                    pushBack = 0;
                }

                // Animation for the shield
                animation.x = victim.x;
                animation.y = victim.y - 30;
                this.scene.add(animation);

                // Push back
                this.scene.add(new Interpolator(this, 'x', this.x, this.x - cos(angle) * pushBack, 0.3));
                this.scene.add(new Interpolator(this, 'y', this.y, this.y - sin(angle) * pushBack, 0.3));
            } else {
                victim.damage(damage);

                victim.x += cos(angle) * damage * 10;
                victim.y += sin(angle) * damage * 10;

                this.updateCombo(1, nomangle('Hit'));
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
        this.updateCombo(-99999, nomangle('Ouch!'));

        // Death
        if (this.health <= 0) this.remove();
    }

    render() {
        super.render();

        const { inWater } = this;

        ctx.translate(this.x, this.y);

        ctx.withShadow((color, shadow) => {
            if (inWater) {
                ctx.beginPath();
                ctx.rect(-100, -100, 200, 100);
                ctx.clip();

                ctx.translate(0, 10);
            }

            for (const step of this.renderSteps) {
                ctx.wrap(() => step(color, shadow));
            }
        });

        // if (DEBUG) {
        //     ctx.lineWidth = 1;
        //     ctx.strokeStyle = '#f00';
        //     ctx.beginPath();
        //     ctx.ellipse(0, 0, this.strikeRadiusX, this.strikeRadiusY, 0, 0, TWO_PI);
        //     ctx.stroke();
        // }
    }

    dash() {
        const duration = 0.2;
        const { angle } = this.controls;
        this.scene.add(new Interpolator(this, 'x', this.x, this.x + cos(angle) * 200, duration));
        this.scene.add(new Interpolator(this, 'y', this.y, this.y + sin(angle) * 200, duration));

        this.waitingForDashRelease = true;
        this.dashStart = this.age;
        this.dashEnd = this.age + duration;

        this.loseStamina(0.2);
    }
}
