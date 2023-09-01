class StateMachine {
    transitionToState(state) {
        state.stateMachine = this;
        state.previous = this.state || new State();
        state.onEnter();
        this.state = state;
    }

    cycle(elapsed) {
        this.state.cycle(elapsed);
    }
}

class State {

    constructor() {
        this.age = 0;
    }

    get swordRaiseRatio() { return 0; }
    get shieldRaiseRatio() { return 0; }
    get speedRatio() { return 1; }
    get attackPreparationRatio() { return 0; }

    onEnter() {

    }

    cycle(elapsed) {
        this.age += elapsed;
    }
}

characterStateMachine = ({
    entity,
    chargeTime,
    perfectParryTime,
    releaseAttackBetweenStrikes,
    staggerTime,
}) => {
    const { controls } = entity;
    const stateMachine = new StateMachine();

    const attackDamagePattern = [
        0.7,
        0.8,
        0.9,
        1,
        3,
    ];

    chargeTime = chargeTime || 1;
    perfectParryTime = perfectParryTime || 0;
    staggerTime = staggerTime || 0;

    class MaybeExhaustedState extends State {
        cycle(elapsed) {
            super.cycle(elapsed);
            if (entity.stamina === 0) {
                stateMachine.transitionToState(new Exhausted());
            }
            if (entity.age - entity.lastDamage < staggerTime) {
                stateMachine.transitionToState(new Staggered());
            }
        }
    }
    
    class Idle extends MaybeExhaustedState {
        get swordRaiseRatio() { return interpolate(this.previous.swordRaiseRatio, 0, this.age / 0.1); }
        get shieldRaiseRatio() { return interpolate(this.previous.shieldRaiseRatio, 0, this.age / 0.1); }

        get speedRatio() { 
            return entity.inWater ? 0.5 : 1; 
        }

        cycle(elapsed) {
            super.cycle(elapsed);
            if (controls.shield) {
                stateMachine.transitionToState(new Shielding());
            } else if (controls.attack) {
                stateMachine.transitionToState(new Charging());
            } else if (controls.dash) {
                stateMachine.transitionToState(new Dashing());
            }
        }
    }

    class Shielding extends MaybeExhaustedState {
        get speedRatio() { 
            return 0.5; 
        }

        get shieldRaiseRatio() { return interpolate(0, 1, this.age / 0.1); }
        get swordRaiseRatio() { return interpolate(0, -1, this.age / 0.1); }
        get shielded() { return true; }
        get perfectParry() { return this.age < perfectParryTime; }

        cycle(elapsed) {
            super.cycle(elapsed);
            if (!controls.shield) {
                stateMachine.transitionToState(new Idle());
            }
        }
    }

    class Dashing extends State {

        get swordRaiseRatio() { 
            return interpolate(this.previous.swordRaiseRatio, -1, this.age / (PLAYER_DASH_DURATION / 2)); 
        }

        onEnter() {
            this.dashAngle = entity.controls.angle;

            entity.dash(entity.controls.angle, PLAYER_DASH_DISTANCE, PLAYER_DASH_DURATION);
            sound(...[1.99,,427,.01,,.07,,.62,6.7,-0.7,,,,.2,,,.11,.76,.05]);

            entity.loseStamina(0.15);
        }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (this.age > PLAYER_DASH_DURATION) {
                stateMachine.transitionToState(new Idle());
            }
        }
    }

    class Charging extends MaybeExhaustedState {
        constructor(counter = 0) {
            super();
            this.counter = counter;
        }

        get speedRatio() { 
            return 0.5; 
        }

        get attackPreparationRatio() {
            return this.age / chargeTime;
        }

        get swordRaiseRatio() { 
            return interpolate(this.previous.swordRaiseRatio, -1, this.attackPreparationRatio); 
        }

        cycle(elapsed) {
            const { attackPreparationRatio } = this;

            super.cycle(elapsed);

            if (!controls.attack) {
                const counter = this.age >= 1 ? attackDamagePattern.length - 1 : this.counter;
                stateMachine.transitionToState(new Strike(counter));
            }

            if (attackPreparationRatio < 1 && this.attackPreparationRatio >= 1) {
                const animation = entity.scene.add(new FullCharge());
                animation.x = entity.x - entity.facing * 20;
                animation.y = entity.y - 60;
            }
        }
    }

    class Strike extends MaybeExhaustedState {
        constructor(counter = 0) {
            super();
            this.counter = counter;
            this.prepareRatio = -min(PLAYER_HEAVY_ATTACK_INDEX, this.counter + 1) * 0.4;
        }

        get swordRaiseRatio() { 
            return this.age < STRIKE_WINDUP 
                ? interpolate(
                    this.previous.swordRaiseRatio, 
                    this.prepareRatio, 
                    this.age / STRIKE_WINDUP,
                )
                : interpolate(
                    this.prepareRatio, 
                    1, 
                    (this.age - STRIKE_WINDUP) / (STRIKE_DURATION - STRIKE_WINDUP),
                );   
        }

        onEnter() {
            entity.lunge();

            this.anim = new SwingEffect(
                entity, 
                this.counter == attackDamagePattern.length - 1 ? '#ff0' : '#fff', 
                this.prepareRatio, 
                0,
            );
        }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (this.age >= STRIKE_WINDUP) {
                entity.scene.add(this.anim);
                this.anim.toAngle = this.swordRaiseRatio;
            }

            if (controls.attack) this.didTryToAttackAgain = true;
            if (controls.dash) this.didTryToDash = true;

            if (this.age > 0.15) {
                entity.strike(attackDamagePattern[this.counter]);

                if (this.didTryToDash) {
                    stateMachine.transitionToState(new Dashing());   
                    return; 
                }

                stateMachine.transitionToState(
                    this.counter < PLAYER_HEAVY_ATTACK_INDEX
                        ? this.didTryToAttackAgain
                            ? new Charging(this.counter + 1)
                            : new LightRecover(this.counter)
                        : new HeavyRecover()
                );
            }
        }
    }

    class LightRecover extends MaybeExhaustedState {
        constructor(counter) {
            super();
            this.counter = counter;
        }

        get swordRaiseRatio() { 
            const start = 1;
            const end = 0;

            const ratio = min(1, this.age / 0.05); 
            return ratio * (end - start) + start;
        }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (!controls.attack || !releaseAttackBetweenStrikes) {
                this.readyToAttack = true;
            }

            if (this.age > 0.3) {
                stateMachine.transitionToState(new Idle());
            } else if (controls.attack && this.readyToAttack) {
                stateMachine.transitionToState(new Charging(this.counter + 1));
            } else if (controls.shield) {
                stateMachine.transitionToState(new Shielding());
            } else if (controls.dash) {
                stateMachine.transitionToState(new Dashing());
            }
        }
    }

    class HeavyRecover extends MaybeExhaustedState {

        get swordRaiseRatio() { 
            const start = 1;
            const end = 0;

            const ratio = min(this.age / 0.5, 1); 
            return ratio * (end - start) + start;
        }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (this.age > 0.5) {
                stateMachine.transitionToState(new Idle());
            } else if (controls.dash) {
                stateMachine.transitionToState(new Dashing());
            }
        }
    }

    class Exhausted extends State {
        get swordRaiseRatio() { 
            return interpolate(this.previous.swordRaiseRatio, 1, this.age / 0.2); 
        }

        get exhausted() {
            return true;
        }
        
        get speedRatio() { 
            return 0.5; 
        }

        onEnter() {
            if (!entity.perfectlyBlocked) entity.displayLabel(nomangle('Exhausted'));
            entity.perfectBlocked = false;
        }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (entity.stamina >= 1) {
                stateMachine.transitionToState(new Idle());
            }
        }
    }

    class Staggered extends State {
        get swordRaiseRatio() { 
            return this.previous.swordRaiseRatio; 
        }
        
        get speedRatio() { 
            return 0.5; 
        }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (this.age >= staggerTime) {
                stateMachine.transitionToState(new Idle());
            }
        }
    }

    stateMachine.transitionToState(new Idle());

    return stateMachine;
}
