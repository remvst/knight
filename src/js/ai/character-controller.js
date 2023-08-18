class CharacterController {
    start(entity) {
        this.entity = entity;
    }
}

class AI extends CharacterController {

    start(entity) {
        super.start(entity);
        return new Promise((resolve) => this.resolve = () => {
            this.resolve = () => {};
            resolve();
        });
    }

    cycle() {
        const player = firstItem(this.entity.scene.category('player'));
        if (player) {
            this.update(player);
        } else {
            this.entity.controls.attack = false;
        }
    }

    update(player) {

    }
}

class EnemyAI extends AI {

    constructor() {
        super();
        this.ais = new Set();
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        for (const ai of this.ais.values()) {
            ai.cycle(elapsed);
        }
    }

    async start(entity) {
        super.start(entity);
        await this.doStart(entity);
    }

    async doStart() {
        // implement in subclasses
    }

    update(player) {
        this.entity.controls.aim.x = player.x;
        this.entity.controls.aim.y = player.y;
    }

    startAI(ai) {
        return this.race([ai]);
    }

    async race(ais) {
        for (const ai of ais) {
            this.ais.add(ai);
        }
        await Promise.race(ais.map(ai => {
            return ai.start(this.entity);
        }));
        for (const ai of ais) {
            this.ais.delete(ai);
        }
    }
}

class WaitAI extends AI {

    constructor(duration) {
        super();
        this.duration = duration;
    }

    start(entity) {
        this.endTime = entity.age + this.duration;
        return super.start(entity);
    }

    update() {
        if (this.entity.age > this.endTime) {
            this.resolve();
        }
    }
}

class LightAttackAI extends AI {
    update(player) {
        const { controls } = this.entity;

        controls.force = 0;

        if (!this.entity.controls.attack) {
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
    constructor(distance = 200) {
        super();
        this.distance = distance;
    }

    update(player) {
        this.entity.controls.force = 0;

        if (dist(player, this.entity) < this.distance) {
            // Get away from the player
            this.entity.controls.force = 1;
            this.entity.controls.angle = angleBetween(player, this.entity);
        } else {
            this.resolve();
        }
    }

    resolve() {
        this.entity.controls.force = 0;
        super.resolve();
    }
}

class ShieldAI extends AI {
    update() {
        this.entity.controls.shield = true;
    }

    resolve() {
        this.entity.controls.shield = false;
        super.resolve();
    }
}

// class TimeoutAI extends AI {
//     constructor(other, timeout) {
//         super();
//         this.other = other;
//         this.timeout = timeout;
//     }

//     start() {
//         this.endTime = this.entity.age + this.duration;

//         return Promise.race([
//             this.other.start(),
//             super.start(),
//         ]);
//     }

//     update() {
//         if (this.entity.age > this.endTime) {
//             this.resolve();
//         }
//     }
// }
