FOV_GRADIENT = [0, 255].map(red => createCanvas(1, 1, ctx => {
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, PLAYER_MAGNET_RADIUS);
    grad.addColorStop(0, 'rgba(' + red + ',0,0,.1)');
    grad.addColorStop(1, 'rgba(' + red + ',0,0,0)');
    return grad;
}));

class Player extends Character {
    constructor() {
        super();
        this.categories.push('player');

        this.targetTeam = 'enemy';

        this.score = 0;

        this.baseSpeed = 250;
        this.strength = 30;

        this.staminaRecoveryDelay = 2;

        this.magnetRadiusX = this.magnetRadiusY = PLAYER_MAGNET_RADIUS;

        this.affectedBySpeedRatio = false;

        this.damageLabelColor = '#f00';

        this.gibs = [
            () => ctx.renderSword(),
            () => ctx.renderShield(),
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: PLAYER_HEAVY_CHARGE_TIME,
            perfectParryTime: PLAYER_PERFECT_PARRY_TIME,
            releaseAttackBetweenStrikes: true,
            staggerTime: 0.2,
        });
    }

    get ai() {
        return new PlayerController();
    }

    damage(amount) {
        super.damage(amount);
        sound(...[2.07,,71,.01,.05,.03,2,.14,,,,,.01,1.5,,.1,.19,.95,.05,.16]);
    }

    getColor(color) {
        return this.age - this.lastDamage < 0.1 ? '#f00' : super.getColor(color);
    }

    heal(amount) {
        amount = ~~min(this.maxHealth - this.health, amount);
        this.health += amount

        for (let i = amount ; --i > 0 ;) {
            setTimeout(() => {
                const angle = random() * TWO_PI;
                const dist = random() * 40;

                const x = this.x + rnd(-10, 10);
                const y = this.y - 30 + sin(angle) * dist;

                this.scene.add(new Particle(
                    '#0f0',
                    [5, 10],
                    [x, x + rnd(-10, 10)],
                    [y, y + rnd(-30, -60)],
                    rnd(1, 1.5),
                ));
            }, i * 100);
        }
    }

    render() {
        const victim = this.pickVictim(this.magnetRadiusX, this.magnetRadiusY, PI / 2);
        if (victim) {
            ctx.wrap(() => {
                if (RENDER_SCREENSHOT) return;

                ctx.globalAlpha = 0.2;
                ctx.strokeStyle = '#f00';
                ctx.lineWidth = 5;
                ctx.setLineDash([10, 10]);
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(victim.x, victim.y);
                ctx.stroke();
            });
        }

        ctx.wrap(() => {
            if (RENDER_SCREENSHOT) return;

            ctx.translate(this.x, this.y);

            const aimAngle = angleBetween(this, this.controls.aim);
            ctx.fillStyle = FOV_GRADIENT[+!!victim];
            ctx.beginPath();
            ctx.arc(0, 0, this.magnetRadiusX, aimAngle - PI / 4, aimAngle + PI / 4);
            ctx.lineTo(0, 0);
            ctx.fill();
        });

        if (DEBUG && DEBUG_PLAYER_MAGNET) {
            ctx.wrap(() => {
                ctx.fillStyle = '#0f0';
                for (let x = this.x - this.magnetRadiusX - 20 ; x < this.x + this.magnetRadiusX + 20 ; x += 4) {
                    for (let y = this.y - this.magnetRadiusY - 20 ; y < this.y + this.magnetRadiusY + 20 ; y += 4) {
                        ctx.globalAlpha = this.strikability({ x, y }, this.magnetRadiusX, this.magnetRadiusY, PI / 2);
                        ctx.fillRect(x - 2, y - 2, 4, 4);
                    }
                }
            });
            ctx.wrap(() => {
                for (const victim of this.scene.category(this.targetTeam)) {
                    const strikability = this.strikability(victim, this.magnetRadiusX, this.magnetRadiusY, PI / 2);
                    if (!strikability) continue;
                    ctx.lineWidth = strikability * 30;
                    ctx.strokeStyle = '#ff0';
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(victim.x, victim.y);
                    ctx.stroke();
                }
            });
        }

        super.render();
    }

    renderBody() {
        ctx.renderLegs(this, COLOR_LEGS);
        ctx.renderArm(this, COLOR_LEGS, () => ctx.renderSword());
        ctx.renderHead(this, COLOR_SKIN);
        ctx.renderChest(this, COLOR_ARMOR, CHEST_WIDTH_ARMORED);
        ctx.renderArmAndShield(this, COLOR_LEGS);
        ctx.renderExhaustion(this, -70);
    }
}

class PlayerController extends CharacterController {
    // get description() {
    //     return 'Player';
    // }

    cycle() {
        let x = 0, y = 0;
        if (DOWN[37] || DOWN[65]) x = -1;
        if (DOWN[38] || DOWN[87]) y = -1;
        if (DOWN[39] || DOWN[68]) x = 1;
        if (DOWN[40] || DOWN[83]) y = 1;

        const camera = firstItem(this.entity.scene.category('camera'));

        if (x || y) this.entity.controls.angle = atan2(y, x);
        this.entity.controls.force = x || y ? 1 : 0;
        this.entity.controls.shield = DOWN[16] || MOUSE_RIGHT_DOWN || TOUCH_SHIELD_BUTTON.down;
        this.entity.controls.attack = MOUSE_DOWN || TOUCH_ATTACK_BUTTON.down;
        this.entity.controls.dash = DOWN[32] || DOWN[17] || TOUCH_DASH_BUTTON.down;

        const mouseRelX = (MOUSE_POSITION.x - CANVAS_WIDTH / 2) / (CANVAS_WIDTH / 2);
        const mouseRelY = (MOUSE_POSITION.y - CANVAS_HEIGHT / 2) / (CANVAS_HEIGHT / 2);

        this.entity.controls.aim.x = this.entity.x + mouseRelX * CANVAS_WIDTH / 2 / camera.appliedZoom;
        this.entity.controls.aim.y = this.entity.y + mouseRelY * CANVAS_HEIGHT / 2 / camera.appliedZoom;

        if (inputMode == INPUT_MODE_TOUCH) {
            const { touch } = TOUCH_JOYSTICK;
            this.entity.controls.aim.x = this.entity.x + (touch.x - TOUCH_JOYSTICK.x);
            this.entity.controls.aim.y = this.entity.y + (touch.y - TOUCH_JOYSTICK.y);

            this.entity.controls.angle = angleBetween(TOUCH_JOYSTICK, touch);
            this.entity.controls.force = TOUCH_JOYSTICK.touchIdentifier < 0
                ? 0
                : min(1, dist(touch, TOUCH_JOYSTICK) / TOUCH_JOYSTICK_RADIUS);
        }

        if (x) this.entity.facing = x;
    }
}
