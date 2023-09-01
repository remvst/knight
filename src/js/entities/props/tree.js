class Tree extends Obstacle {

    constructor() {
        super();

        this.trunkWidth = this.rng.next(10, 20);
        this.trunkHeight = this.rng.next(100, 250);

        this.collisionRadius = 20;
        this.alpha = 1;
        
        this.renderPadding = this.trunkHeight + 60;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (!this.noRegen) regenEntity(this, CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2 + 400);

        this.rng.reset();

        let targetAlpha = 1;
        for (const character of this.scene.category('player')) {
            if (
                isBetween(this.x - 100, character.x, this.x + 100) &&
                isBetween(this.y - this.trunkHeight - 50, character.y, this.y)
            ) {
                targetAlpha = 0.2;
                break;
            }
        }

        this.alpha += between(-elapsed * 2, targetAlpha - this.alpha, elapsed * 2);
    }

    doRender() {
        ctx.translate(this.x, this.y);
        
        ctx.withShadow(() => {
            this.rng.reset();

            ctx.wrap(() => {
                ctx.rotate(sin((this.age + this.rng.next(0, 10)) * TWO_PI / this.rng.next(4, 16)) * this.rng.next(PI / 32, PI / 64));
                ctx.fillStyle = ctx.resolveColor('#a65');

                if (!ctx.isShadow) {
                    ctx.globalAlpha = this.alpha;
                }

                if (!ctx.isShadow) ctx.fillRect(0, 0, this.trunkWidth, -this.trunkHeight);

                ctx.translate(0, -this.trunkHeight);

                ctx.beginPath();
                ctx.fillStyle = ctx.resolveColor('#060');

                for (let i = 0 ; i < 5 ; i++) {
                    const angle = i / 5 * TWO_PI;
                    const dist = this.rng.next(20, 50);
                    const x =  cos(angle) * dist;
                    const y = sin(angle) * dist * 0.5;
                    const radius = this.rng.next(20, 40);

                    ctx.wrap(() => {
                        ctx.translate(x, y);
                        ctx.rotate(PI / 4);
                        ctx.rotate(sin((this.age + this.rng.next(0, 10)) * TWO_PI / this.rng.next(2, 8)) * PI / 32);
                        ctx.rect(-radius, -radius, radius * 2, radius * 2);
                    });
                }

                if (ctx.isShadow) ctx.rect(0, 0, this.trunkWidth, this.trunkHeight);

                ctx.fill();
            });

            ctx.clip();

            if (!ctx.isShadow) {
                for (const character of this.scene.category('enemy')) {
                    if (
                        isBetween(this.x - 100, character.x, this.x + 100) &&
                        isBetween(this.y - this.trunkHeight - 50, character.y, this.y)
                    ) {
                        ctx.resolveColor = () => character instanceof Player ? '#888' : '#400';
                        ctx.wrap(() => {
                            ctx.translate(character.x - this.x, character.y - this.y);
                            ctx.scale(character.facing, 1);
                            ctx.globalAlpha = this.alpha;
                            character.renderBody();
                        });
                    }
                }
            }
        });
    }
}
