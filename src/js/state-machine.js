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
}) => {
    const { controls } = entity;
    const stateMachine = new StateMachine();

    chargeTime = chargeTime || 1;
    perfectParryTime = perfectParryTime || 0;
    
    class Idle extends State {
        get swordRaiseRatio() { return interpolate(this.previous.swordRaiseRatio, 0, this.age / 0.1); }
        get shieldRaiseRatio() { return interpolate(this.previous.shieldRaiseRatio, 0, this.age / 0.1); }

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
            } else if (controls.dash) {
                this.stateMachine.transitionToState(new Dashing());
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
                stateMachine.transitionToState(new Strike(counter));
            }
        }
    }

    class Strike extends State {
        constructor(counter = 0) {
            super();
            this.counter = counter;
        }

        get swordRaiseRatio() { 
            return interpolate(-(this.counter + 1) * 0.4, 1, this.age / 0.05);
        }

        onEnter() {
            const target = entity.lunge();

            const anim = new SwingEffect(
                entity, 
                this.counter == PLAYER_HEAVY_ATTACK_INDEX ? '#ff0' : '#fff', 
                min(this.previous.swordRaiseRatio, this.swordRaiseRatio), 
                0,
            );
            anim.x = target.x;
            anim.y = target.y;
            entity.scene.add(anim);
        }

        cycle(elapsed) {
            super.cycle(elapsed);

            if (this.age > 0.1) {
                entity.strike((this.counter + 1) * 0.15);

                if (this.counter < PLAYER_HEAVY_ATTACK_INDEX) {
                    stateMachine.transitionToState(new LightRecover(this.counter));
                } else {
                    stateMachine.transitionToState(new HeavyRecover());
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
                stateMachine.transitionToState(new Idle());
            } else if (controls.attack && this.readyToAttack) {
                stateMachine.transitionToState(new Strike(this.counter + 1));
            } else if (controls.shield) {
                stateMachine.transitionToState(new Shielding());
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

    stateMachine.transitionToState(new Idle());

    

    return stateMachine;
}
