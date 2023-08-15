class Player extends Character {
    constructor() {
        super();
        this.categories.push('player');

        this.targetTeam = 'enemy';

        this.controller = new PlayerController();
        this.controller.setEntity(this);

        this.timeToPrepareHeavyAttack = 1;
        this.timeToStrike = 0.05;
        this.timeToCooldown = 0.1;

        this.attackMagnetRadiusX = this.strikeRadiusX * 3;
        this.attackMagnetRadiusY = this.strikeRadiusY * 3;

        this.renderSteps = [
            (color) => renderLegs(this, color),
            (color) => renderChest(this, color),
            (color) => renderSword(this, color),
            (color) => renderShield(this, color),
            (color, shadow) => renderExhaustion(this, color, shadow, -70),
        ];
    }

    magnetizability(character) {
        if (character === this) return 0;

        const angle = atan2(character.y - this.y, character.x - this.x);
        const angleDiff = normalize(this.controls.angle - angle);

        const angleAffinity = 1 - abs(angleDiff / (PI / 4));
        if (angleAffinity < 0) return 0;

        const distX = 1 - abs(character.x - this.x) / this.attackMagnetRadiusX;
        const distY = 1 - abs(character.y - this.y) / this.attackMagnetRadiusY;

        if (distX < 0 || distY < 0) {
            return 0;
        }

        if (this.isWithinStrikeRadius(character)) {
            return 3;
        }

        return angleAffinity + distX + distY;
    }

    render() {
        super.render();

        if (DEBUG) {
            ctx.fillStyle = '#000';

            ctx.translate(this.controls.aim.x - this.x, this.controls.aim.y - this.y);

            ctx.rotate(PI / 4);
            ctx.fillRect(-15, -5, 30, 10);
            ctx.rotate(PI / 2);
            ctx.fillRect(-15, -5, 30, 10);
        }

        // for (const victim of this.scene.category(this.targetTeam)) {
        //     const magnetizability = this.magnetizability(victim);
        //     if (magnetizability <= 0) continue;

        //     ctx.wrap(() => {
        //         ctx.lineWidth = magnetizability * 20;
        //         ctx.strokeStyle = '#0f0';
        //         ctx.beginPath();
        //         ctx.moveTo(0, 0);
        //         ctx.lineTo(victim.x - this.x, victim.y - this.y)
        //         ctx.stroke();
        //     });
        // }
    }

    attack() {
        super.attack();

        // const victim = Array
        //     .from(this.scene.category(this.targetTeam))
        //     .reduce((acc, other) => {
        //         const magnetOther = this.magnetizability(other);
        //         if (!acc && magnetOther > 0) return other;
        //         const magnetAcc = this.magnetizability(acc);
        //         return magnetOther > magnetAcc ? other : acc;
        //     }, null);

        const victim = Array
            .from(this.scene.category(this.targetTeam))
            .reduce((acc, other) => {
                const distOther = dist(other, this.controls.aim);
                if (!acc && distOther > 0) return other;
                const distAcc = dist(acc, this.controls.aim);
                return distOther < distAcc ? other : acc;
            }, null);

        // if (victim && !this.isWithinStrikeRadius(victim)) {
        //     const angle = atan2(this.y - victim.y, this.x - victim.x);

        //     this.scene.add(new Interpolator(this, 'x', this.x, victim.x + cos(angle) * this.strikeRadiusX / 2, this.timeToStrike));
        //     this.scene.add(new Interpolator(this, 'y', this.y, victim.y + sin(angle) * this.strikeRadiusY / 2, this.timeToStrike));
        // }
    }

    strike() {
        super.strike();

        // TODO if heavy attack, animation
        // const anim = new PerfectParry();
        // anim.x = this.x;
        // anim.y = this.y;
        // this.scene.add(anim);
    }
}

class PlayerController extends CharacterController {
    cycle() {
        let x = 0, y = 0;
        if (DOWN[37] || DOWN[65]) x = -1;
        if (DOWN[38] || DOWN[87]) y = -1;
        if (DOWN[39] || DOWN[68]) x = 1;
        if (DOWN[40] || DOWN[83]) y = 1;

        const camera = firstItem(this.entity.scene.category('camera'));

        if (x || y) this.entity.controls.angle = atan2(y, x);
        this.entity.controls.force = x || y ? 1 : 0;
        this.entity.controls.shield = DOWN[32];
        this.entity.controls.attack = MOUSE_DOWN;
        this.entity.controls.aim.x = MOUSE_POSITION.x + camera.x - CANVAS_WIDTH / 2;
        this.entity.controls.aim.y = MOUSE_POSITION.y + camera.y - CANVAS_HEIGHT / 2;

        if (x) this.entity.facing = x;
    }
}
