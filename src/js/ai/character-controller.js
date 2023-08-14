class CharacterController {
    setEntity(entity) {
        this.entity = entity;
    }
}

class PlayerController extends CharacterController {
    cycle() {
        let x = 0, y = 0;
        if (DOWN[37]) x = -1;
        if (DOWN[38]) y = -1;
        if (DOWN[39]) x = 1;
        if (DOWN[40]) y = 1;

        this.entity.controls.angle = atan2(y, x);
        this.entity.controls.force = x || y ? 1 : 0;
        this.entity.controls.shield = DOWN[16];
        this.entity.controls.attack = DOWN[32];

        if (x) this.entity.facing = x;
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
        this.entity.facing = sign(player.x - this.entity.x);
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
        this.lastAttack = 0;
    }

    update(player) {
        this.entity.controls.force = 0;
        this.entity.controls.attack = false;

        if (!this.entity.isWithinStrikeRadius(player)) {
            // Approach the player
            this.entity.controls.force = 1;
            this.entity.controls.angle = angleBetween(this.entity, player);
        } else {
            // Strike!
            if (this.entity.age - this.lastAttack > 0.5) {
                this.entity.controls.attack = true;    
                this.lastAttack = this.entity.age;
            } else {
                this.entity.controls.attack = false;
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
