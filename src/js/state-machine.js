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
    get shielded() { return false; }
    get perfectParry() { return false; }

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
        2,
    ];

    chargeTime = chargeTime || 1;
    perfectParryTime = perfectParryTime || 0;
    staggerTime = staggerTime || 0;

    class MaybeExhaustedState extends State {
        cycle(elapsed) {
            super.cycle(elapsed);
            if (entity.stamina === 0) {
                this.stateMachine.transitionToState(new Exhausted());
            }
            if (entity.age - entity.lastDamage < staggerTime) {
                this.stateMachine.transitionToState(new Staggered());
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
                this.stateMachine.transitionToState(new Shielding());
            } else if (controls.attack) {
                this.stateMachine.transitionToState(new Charging());
            } else if (controls.dash) {
                this.stateMachine.transitionToState(new Dashing());
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
            super.cycle(elapsed);

            if (!controls.attack) {
                const counter = this.age >= 1 ? attackDamagePattern.length - 1 : this.counter;
                stateMachine.transitionToState(new Strike(counter));
            }
        }
    }

    class Strike extends MaybeExhaustedState {
        constructor(counter = 0) {
            super();
            this.counter = counter;
            this.prepareRatio = -min(PLAYER_HEAVY_ATTACK_INDEX, this.counter + 1) * 0.4;
            this.windup = 0.05;
            this.duration = 0.15;
        }

        get swordRaiseRatio() { 
            return this.age < this.windup 
                ? interpolate(
                    this.previous.swordRaiseRatio, 
                    this.prepareRatio, 
                    this.age / this.windup,
                )
                : interpolate(
                    this.prepareRatio, 
                    1, 
                    (this.age - this.windup) / (this.duration - this.windup),
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

            if (this.age >= this.windup) {
                entity.scene.add(this.anim);
                this.anim.toAngle = this.swordRaiseRatio;
            }

            if (controls.attack) {
                this.didTryToAttackAgain = true;
            }

            if (this.age > 0.15) {
                entity.strike(attackDamagePattern[this.counter]);

                if (this.counter < PLAYER_HEAVY_ATTACK_INDEX) {
                    if (this.didTryToAttackAgain) {
                        stateMachine.transitionToState(new Charging(this.counter + 1));    
                    } else {
                        stateMachine.transitionToState(new LightRecover(this.counter));
                    }
                } else {
                    stateMachine.transitionToState(new HeavyRecover());
                }
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
