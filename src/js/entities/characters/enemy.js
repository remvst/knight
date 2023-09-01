class Enemy extends Character {

    constructor() {
        super();
        this.categories.push('enemy');
        this.targetTeam = 'player';
    }

    remove() {
        super.remove();

        // Cancel any remaining aggression
        firstItem(this.scene.category('aggressivity-tracker'))
            .cancelAggression(this);
    }

    die() {
        super.die();

        for (const player of this.scene.category('player')) {
            player.score += ~~(100 * this.aggression * player.combo);
        }
    }

    damage(amount) {
        super.damage(amount);
        sound(...[1.6,,278,,.01,.01,2,.7,-7.1,,,,.07,1,,,.09,.81,.08]);
    }
}

createEnemyAI = ({
    shield, 
    attackCount,
}) => {
    class EnemyTypeAI extends EnemyAI {
        async doStart() {
            while (true) {
                // Try to be near the player
                await this.startAI(new ReachPlayer(300, 300));
                
                // Wait for our turn to attack
                try {
                    await this.race([
                        new Timeout(3),
                        new BecomeAggressive(),
                    ]);
                } catch (e) {
                    // We failed to become aggressive, start a new loop
                    continue;
                }

                await this.startAI(new BecomeAggressive());

                // Okay we're allowed to be aggro, let's do it!
                let failedToAttack;
                try {
                    await this.race([
                        new Timeout(500 / this.entity.baseSpeed),
                        new ReachPlayer(this.entity.strikeRadiusX, this.entity.strikeRadiusY),
                    ]);

                    for (let i = attackCount ; i-- ; ) {
                        await this.startAI(new Attack(0.5));
                    }
                    await this.startAI(new Wait(0.5));
                } catch (e) {
                    failedToAttack = true;
                }

                // We're done attacking, let's allow someone else to be aggro
                await this.startAI(new BecomePassive());

                // Retreat a bit so we're not too close to the player
                const dash = !shield && !failedToAttack && random() < 0.5;
                await this.race([
                    new RetreatAI(300, 300),
                    new Wait(dash ? 0.1 : 4),
                    dash 
                        ? new Dash() 
                        : (shield ? new HoldShield() : new AI()),
                ]);
                await this.startAI(new Wait(1));

                // Rinse and repeat
            }
        }
    }

    return EnemyTypeAI;
}

createEnemyType = ({
    stick, sword, axe,
    shield, armor, superArmor,
    attackCount,
}) => {
    const ai = createEnemyAI({ shield, attackCount });

    const weight = 0
        + (!!armor * 0.2) 
        + (!!superArmor * 0.3) 
        + (!!axe * 0.1)
        + (!!(sword || shield) * 0.3);

    const protection = 0
        + (!!shield * 0.3)
        + (!!armor * 0.5)
        + (!!superArmor * 0.7);

    class EnemyType extends Enemy {
        constructor() {
            super();

            this.aggression = 1;
            if (sword) this.aggression += 1;
            if (axe) this.aggression += 2;

            this.health = this.maxHealth = ~~interpolate(100, 400, protection);
            this.strength = axe ? 35 : (sword ? 25 : 10);
            this.baseSpeed = interpolate(120, 50, weight);
    
            if (stick) this.gibs.push(() => ctx.renderStick());
            if (sword) this.gibs.push(() => ctx.renderSword());
            if (shield) this.gibs.push(() => ctx.renderShield());
            if (axe) this.gibs.push(() => ctx.renderAxe());
    
            this.stateMachine = characterStateMachine({
                entity: this, 
                chargeTime: 0.5,
                staggerTime: interpolate(0.3, 0.1, protection),
            });
        }

        get ai() {
            return new ai(this);
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

    return EnemyType;
};

shield = { shield: true };
sword = { sword: true, attackCount: 2 };
stick = { stick: true, attackCount: 3 };
axe = { axe: true, attackCount: 1 };
armor = { armor: true };
superArmor = { superArmor: true };

ENEMY_TYPES = [
    // Weapon
    StickEnemy = createEnemyType({ ...stick, }),
    AxeEnemy = createEnemyType({ ...axe, }),
    SwordEnemy = createEnemyType({ ...sword, }),

    // Weapon + armor
    SwordArmorEnemy = createEnemyType({ ...sword, ...armor, }),
    AxeArmorEnemy = createEnemyType({ ...axe, ...armor, }),

    // Weapon + armor + shield
    AxeShieldArmorEnemy = createEnemyType({ ...axe, ...shield, ...armor, }),
    SwordShieldArmorEnemy = createEnemyType({ ...sword, ...shield, ...armor, }),

    // Tank
    SwordShieldTankEnemy = createEnemyType({ ...sword,  ...shield, ...superArmor, }),
    AxeShieldTankEnemy = createEnemyType({ ...axe,  ...shield, ...superArmor, }),
];

WAVE_SETTINGS = [
    ENEMY_TYPES.slice(0, 3),
    ENEMY_TYPES.slice(0, 4),
    ENEMY_TYPES.slice(0, 5),
    ENEMY_TYPES.slice(0, 7),
    ENEMY_TYPES,
];
