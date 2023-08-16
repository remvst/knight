class StateMachine {
    transitionToState(state) {
        state.stateMachine = this;
        state.previous = this.state;
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
}) => {
    const { controls } = entity;
    const stateMachine = new StateMachine();

    chargeTime = chargeTime || 1;
    perfectParryTime = perfectParryTime || 0;
    
    class Idle extends State {
        get speedRatio() { 
            return entity.inWater ? 0.5 : 1; 
        }

        cycle(elapsed) {
            super.cycle(elapsed);
            if (entity.stamina === 0) {
                this.stateMachine.transitionToState(new Exhausted());
            } else if (controls.shield) {
                this.stateMachine.transitionToState(new Shielding());
            } else if (controls.attack) {
                this.stateMachine.transitionToState(new Charging());
            }
        }
    }

    class Shielding extends State {
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
                this.stateMachine.transitionToState(new Unshielding());
            }
        }
    }

    class Unshielding extends State {
        get speedRatio() { 
            return 0.5; 
        }

        get shieldRaiseRatio() { return interpolate(this.previous.shieldRaiseRatio, 0, this.age / 0.1); }
        get swordRaiseRatio() { return interpolate(this.previous.swordRaiseRatio, 0, this.age / 0.1); }

        cycle(elapsed) {
            super.cycle(elapsed);
            if (this.age > 0.2) {
                this.stateMachine.transitionToState(new Idle());
            }
        }
    }

    class Charging extends State {
        get speedRatio() { 
            return 0.5; 
        }

        get attackPreparationRatio() {
            return this.age / chargeTime;
        }

        get swordRaiseRatio() { return -min(1, this.age / chargeTime); }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (!controls.attack) {
                const counter = this.age >= 1 ? PLAYER_HEAVY_ATTACK_INDEX : 0;
                this.stateMachine.transitionToState(new Strike(counter));
            }
        }
    }

    class Strike extends State {
        constructor(counter = 0) {
            super();
            this.counter = counter;
        }

        get swordRaiseRatio() { 
            const start = -(this.counter + 1) * 0.4;
            // const start = this.previous.swordRaiseRatio;;
            const end = 1;

            const ratio = min(1, this.age / 0.05); 
            return ratio * (end - start) + start;
        }

        onEnter() {
            entity.strike((this.counter + 1) * 0.15);

            const anim = new AttackAnim(
                entity, 
                this.counter == PLAYER_HEAVY_ATTACK_INDEX ? '#ff0' : '#fff', 
                this.swordRaiseRatio, 
                0,
            );
            anim.x = entity.x;
            anim.y = entity.y;
            entity.scene.add(anim);
        }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (this.age > 0.1) {
                if (this.counter < PLAYER_HEAVY_ATTACK_INDEX) {
                    this.stateMachine.transitionToState(new LightRecover(this.counter));
                } else {
                    this.stateMachine.transitionToState(new HeavyRecover());
                }
            }
        }
    }

    class LightRecover extends State {
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

            if (!controls.attack) {
                this.readyToAttack = true;
            }

            if (this.age > 0.3) {
                this.stateMachine.transitionToState(new Idle());
            } else if (controls.attack && this.readyToAttack) {
                this.stateMachine.transitionToState(new Strike(this.counter + 1));
            } else if (controls.shield) {
                this.stateMachine.transitionToState(new Shielding());
            }
        }
    }

    class HeavyRecover extends State {

        get swordRaiseRatio() { 
            const start = 1;
            const end = 0;

            const ratio = min(this.age / 0.5, 1); 
            return ratio * (end - start) + start;
        }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (this.age > 0.5) {
                this.stateMachine.transitionToState(new Idle());
            }
        }
    }

    class Exhausted extends State {
        get swordRaiseRatio() { 
            return 1; 
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
                this.stateMachine.transitionToState(new Idle());
            }
        }
    }

    stateMachine.transitionToState(new Idle());

    

    return stateMachine;
}
