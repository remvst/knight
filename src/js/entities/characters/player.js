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

        return angleAffinity + distX + distY;
    }

    render() {
        super.render();

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

        const victim = Array
            .from(this.scene.category(this.targetTeam))
            .reduce((acc, other) => {
                const magnetOther = this.magnetizability(other);
                if (!acc && magnetOther > 0) return other;
                const magnetAcc = this.magnetizability(acc);
                return magnetOther > magnetAcc ? other : acc;
            }, null);

        if (victim && !this.isWithinStrikeRadius(victim)) {
            const angle = atan2(this.y - victim.y, this.x - victim.x);

            this.scene.add(new Interpolator(this, 'x', this.x, victim.x + cos(angle) * this.strikeRadiusX / 2, this.timeToStrike));
            this.scene.add(new Interpolator(this, 'y', this.y, victim.y + sin(angle) * this.strikeRadiusY / 2, this.timeToStrike));
        }
    }
}
