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
        console.log('haha doStart', this.entity);
        while (true) {
            for (let i = 3 ; i > 0 ; i--) {
                await this.startAI(new LightAttackAI());
            }

            await this.race([
                new RetreatAI(),
                new WaitAI(2),
            ]);

            console.log('okie');

            await this.startAI(new WaitAI(2));
        }
    }
}
