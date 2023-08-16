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
            () => ctx.renderLegs(this),
            () => ctx.renderArmAndSword(this),
            () => ctx.renderArmoredChest(this),
            () => ctx.renderArmAndShield(this),
            () => ctx.renderExhaustion(this, -70),
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: PLAYER_HEAVY_CHARGE_TIME,
            perfectParryTime: PLAYER_PERFECT_PARRY_TIME,
        });
    }

    getColor(color) {
        return this.age - this.lastDamage < 0.1 ? '#f00' : super.getColor(color);
    }

    render() {
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            const aimAngle = angleBetween(this, this.controls.aim);
            ctx.fillStyle = 'rgba(0,0,0,.03)';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.strikeRadiusX * 4, this.strikeRadiusY * 4, 0, aimAngle - PI / 8, aimAngle + PI / 8);
            ctx.lineTo(0, 0);
            ctx.fill();
        });

        super.render();
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
