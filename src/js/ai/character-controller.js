class CharacterController {
    setEntity(entity) {
        this.entity = entity;
    }
}

class AI extends CharacterController {

    start() {
        return new Promise((resolve) => this.resolve = () => {
            this.resolve = null;
            resolve();
        });
    }

    cycle() {
        const player = firstItem(this.entity.scene.category('player'));
        if (player) {
            this.update(player);
        }
    }
}

class EnemyAI extends AI {
    async start() {
        while (true) {
            for (let i = rnd(1, 3) ; i > 0 ; i--) {
                await this.startAI(new LightAttackAI());
                await this.startAI(new WaitAI(1));
            }
            await this.startAI(new RetreatAI());
            await this.startAI(new WaitAI(2));
        }
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.currentAI.cycle(elapsed);
    }

    update(player) {
        this.entity.controls.aim.x = player.x;
        this.entity.controls.aim.y = player.y;
    }

    startAI(ai) {
        ai.setEntity(this.entity);
        this.currentAI = ai;
        return this.currentAI.start();
    }
}

class WaitAI extends AI {

    constructor(duration) {
        super();
        this.duration = duration;
    }

    start() {
        this.endTime = this.entity.age + this.duration;
        return super.start();
    }

    update() {
        if (this.entity.age > this.endTime) {
            this.resolve();
        }
    }
}

class LightAttackAI extends AI {
    constructor() {
        super();
    }

    update(player) {
        const { controls } = this.entity;

        controls.force = 0;

        if (!controls.attack) {
            if (!this.entity.isStrikable(player, this.entity.strikeRadiusX, this.entity.strikeRadiusY / 2, PI / 2)) {
                // Approach the player
                controls.force = 1;
                controls.angle = angleBetween(this.entity, player);
            } else {
                // We're close, prepare the attack
                controls.attack = true;
            }
        } else {
            if (this.entity.stateMachine.state.attackPreparationRatio >= 1) {
                // Attack was prepared, release!
                controls.attack = false;
                this.resolve();
            }
        }
    }
}

class RetreatAI extends AI {
    constructor() {
        super();
        this.lastAttack = 0;
    }

    update(player) {
        this.entity.controls.force = 0;

        if (dist(player, this.entity) < 200) {
            // Get away from the player
            this.entity.controls.force = 1;
            this.entity.controls.angle = angleBetween(player, this.entity);
        } else {
            this.resolve();
        }
    }
}
