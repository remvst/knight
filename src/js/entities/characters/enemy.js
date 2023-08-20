createEnemyType = ({
    stick, sword, axe,
    shield, armor, superArmor,
    attackCount,
}) => {
    class EnemyType extends Character {
        constructor() {
            super();
            this.categories.push('enemy');
            this.targetTeam = 'player';

            const weight = 
                + !!sword * 1 
                + !!axe * 1
                + !!armor * 0.5
                + !!superArmor * 0.75;
    
            this.baseSpeed = 200 - weight * 75;
    
            if (stick) this.gibs.push(() => ctx.renderStick());
            if (sword) this.gibs.push(() => ctx.renderSword());
            if (shield) this.gibs.push(() => ctx.renderShield());
            if (axe) this.gibs.push(() => ctx.renderAxe());
    
            this.stateMachine = characterStateMachine({
                entity: this, 
                chargeTime: 0.5,
            });
        }

        get ai() {
            return new EnemyTypeAI(this);
        }
    
        renderBody() {
            ctx.renderAttackIndicator(this);
            ctx.renderLegs(this, COLOR_LEGS);
            ctx.renderArm(this, armor || superArmor ? COLOR_LEGS : COLOR_SKIN, () => {
                if (stick) ctx.renderStick(this)
                if (sword) ctx.renderSword(this);
                if (axe) ctx.renderAxe(this);
            });
            ctx.renderChest(
                this, 
                armor 
                    ? COLOR_ARMOR 
                    : (superArmor ? '#444' : COLOR_SKIN), 
                CHEST_WIDTH_NAKED,
            );

            ctx.renderHead(
                this, 
                superArmor ? '#666' : COLOR_SKIN, 
                superArmor ? '#000' : COLOR_SKIN,
            );

            if (shield) ctx.renderArmAndShield(this, armor || superArmor ? COLOR_LEGS : COLOR_SKIN);
            ctx.renderExhaustion(this, -70);
            ctx.renderExclamation(this);
        }
    }

    class EnemyTypeAI extends EnemyAI {
        async doStart() {
            while (true) {
                await this.startAI(new ReachPlayer(0.5));
                for (let i = attackCount ; i-- ; ) {
                    await this.startAI(new Attack(0.5));
                }
    
                await this.startAI(new Wait(0.5));
    
                await this.race([
                    new RetreatAI(),
                    new Wait(2),
                    shield ? new HoldShield() : new AI(),
                ]);
    
                await this.startAI(new Wait(1));
            }
        }
    }

    return EnemyType;
};
