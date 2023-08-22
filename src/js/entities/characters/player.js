class Player extends Character {
    constructor() {
        super();
        this.categories.push('player');

        this.targetTeam = 'enemy';

        this.baseSpeed = 250;
        this.strength = 30;

        this.magnetRadiusX = 250;
        this.magnetRadiusY = 250;

        this.affectedBySpeedRatio = false;

        this.gibs = [
            () => renderSword(),
            () => renderShield(),
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

    getColor(color) {
        return this.age - this.lastDamage < 0.1 ? '#f00' : super.getColor(color);
    }

    render() {
        wrap(() => {
            translate(this.x, this.y);

            const aimAngle = angleBetween(this, this.controls.aim);
            fillStyle = 'rgba(0,0,0,.03)';
            beginPath();
            ellipse(0, 0, this.strikeRadiusX * 4, this.strikeRadiusY * 4, 0, aimAngle - PI / 4, aimAngle + PI / 4);
            lineTo(0, 0);
            fill();
        });

        if (DEBUG) {
            // wrap(() => {
            //     fillStyle = '#0f0';
            //     for (let x = this.x - this.magnetRadiusX - 20 ; x < this.x + this.magnetRadiusX + 20 ; x += 4) {
            //         for (let y = this.y - this.magnetRadiusY - 20 ; y < this.y + this.magnetRadiusY + 20 ; y += 4) {
            //             globalAlpha = this.strikability({ x, y }, this.magnetRadiusX, this.magnetRadiusY, PI / 2);
            //             fillRect(x - 2, y - 2, 4, 4);
            //         }
            //     }
            // });
            // wrap(() => {
            //     for (const victim of this.scene.category(this.targetTeam)) {
            //         const strikability = this.strikability(victim, this.magnetRadiusX, this.magnetRadiusY, PI / 2);
            //         if (!strikability) continue;
            //         lineWidth = strikability * 30;
            //         strokeStyle = '#ff0';
            //         beginPath();
            //         moveTo(this.x, this.y);
            //         lineTo(victim.x, victim.y);
            //         stroke();
            //     }
            // });
        }

        super.render();
    }

    renderBody() {
        renderLegs(this, COLOR_LEGS);
        renderArm(this, COLOR_LEGS, () => renderSword());
        renderHead(this, COLOR_SKIN);
        renderChest(this, COLOR_ARMOR, CHEST_WIDTH_ARMORED);
        renderArmAndShield(this, COLOR_LEGS);
        renderExhaustion(this, -70);
    }
}

class PlayerController extends CharacterController {
    get description() {
        return 'Player';
    }

    cycle() {
        let x = 0, y = 0;
        if (DOWN[37] || DOWN[65]) x = -1;
        if (DOWN[38] || DOWN[87]) y = -1;
        if (DOWN[39] || DOWN[68]) x = 1;
        if (DOWN[40] || DOWN[83]) y = 1;

        const camera = firstItem(this.entity.scene.category('camera'));

        if (x || y) this.entity.controls.angle = atan2(y, x);
        this.entity.controls.force = x || y ? 1 : 0;
        this.entity.controls.shield = DOWN[16] || MOUSE_RIGHT_DOWN;
        this.entity.controls.attack = MOUSE_DOWN;
        this.entity.controls.dash = DOWN[32];

        const mouseRelX = (MOUSE_POSITION.x - CANVAS_WIDTH / 2) / (CANVAS_WIDTH / 2);
        const mouseRelY = (MOUSE_POSITION.y - CANVAS_HEIGHT / 2) / (CANVAS_HEIGHT / 2);
        this.entity.controls.aim.x = camera.x + mouseRelX * CANVAS_WIDTH / 2 / camera.zoom;
        this.entity.controls.aim.y = camera.y + mouseRelY * CANVAS_HEIGHT / 2 / camera.zoom;

        if (x) this.entity.facing = x;
    }
}
