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

        this.strikeRadiusX = 120;
        this.strikeRadiusY = 60;

        this.renderSteps = [
            (color) => renderLegs(this, color),
            (color) => renderSword(this, color),
            (color) => renderChest(this, color),
            (color) => renderShield(this, color),
            (color, shadow) => renderExhaustion(this, color, shadow, -70),
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: PLAYER_HEAVY_CHARGE_TIME,
            perfectParryTime: PLAYER_PERFECT_PARRY_TIME,
        });
    }

    render() {
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            const aimAngle = angleBetween(this, this.controls.aim);
            ctx.fillStyle = 'rgba(0,0,0,.05)';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.strikeRadiusX * 4, this.strikeRadiusY * 4, 0, aimAngle - PI / 8, aimAngle + PI / 8);
            ctx.lineTo(0, 0);
            ctx.fill();
        });
        
        // ctx.wrap(() => {
        //     ctx.translate(this.x, this.y - 30);
        //     ctx.scale(this.facing, 1);
        //     ctx.fillStyle = '#f00';
        //     ctx.beginPath();
        //     ctx.arc(0, 0, 20, 0, PI / 4, false);
        //     ctx.arc(0, 0, 40, PI / 4, 0, true);
        //     ctx.fill();
        // });

        super.render();

        // if (DEBUG) {
        //     ctx.fillStyle = '#000';

        //     ctx.translate(this.controls.aim.x - this.x, this.controls.aim.y - this.y);

        //     ctx.rotate(PI / 4);
        //     ctx.fillRect(-15, -5, 30, 10);
        //     ctx.rotate(PI / 2);
        //     ctx.fillRect(-15, -5, 30, 10);
        // }
    }

    strike(damage) {
        super.strike(damage);

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
        this.entity.controls.shield = DOWN[16];
        this.entity.controls.attack = MOUSE_DOWN;
        this.entity.controls.aim.x = MOUSE_POSITION.x + camera.x - CANVAS_WIDTH / 2;
        this.entity.controls.aim.y = MOUSE_POSITION.y + camera.y - CANVAS_HEIGHT / 2;
        this.entity.controls.dash = DOWN[32];

        if (x) this.entity.facing = x;
    }
}

class AttackAnim extends Entity {
    constructor(character, color, fromAngle, toAngle) {
        super();
        this.character = character;
        this.color = color;
        this.fromAngle = fromAngle;
        this.toAngle = toAngle;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 0.2) this.remove();
    }

    render() {
        super.render();

        ctx.globalAlpha = 1 - this.age / 0.2;

        ctx.translate(this.x, this.y - 30);
        ctx.scale(this.character.facing, 1);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 40;
        ctx.beginPath();
        ctx.arc(0, 0, 40, this.fromAngle * PI / 2, this.toAngle * PI / 2, false);
        // ctx.arc(0, 0, 40, this.toAngle * PI / 4, 0, true);
        ctx.stroke();
    }
}
