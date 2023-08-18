class TankEnemy extends Character {
    constructor() {
        super();
        this.categories.push('enemy');
        this.targetTeam = 'player';

        this.baseSpeed = 70;

        this.gibs = [
            () => ctx.renderSword(),
            () => ctx.renderShield(),
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: 0.5,
        });
    }

    get ai() {
        return new TankAI(this);
    }

    renderBody() {
        ctx.renderAttackIndicator(this);
        ctx.renderLegs(this, COLOR_LEGS);
        ctx.renderArm(this, COLOR_LEGS, () => ctx.renderSword());
        ctx.renderChest(this, '#444');
        ctx.renderHead(this, '#666', '#000');
        ctx.renderArmAndShield(this);
        ctx.renderExhaustion(this, -70);
        ctx.renderExclamation(this);
    }
}

class TankAI extends EnemyAI {
    async doStart() {
        while (true) {
            await this.startAI(new ReachPlayer(0.5));
            for (let i = 3 ; i > 0 ; i--) {
                await this.startAI(new Attack(0.5));
            }

            await this.startAI(new Wait(0.5));

            await this.race([
                new RetreatAI(),
                new Wait(2),
                new HoldShield(),
            ]);

            await this.startAI(new Wait(1));
        }
    }
}
