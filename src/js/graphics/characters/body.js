CHEST_WIDTH_ARMORED = 25;
CHEST_WIDTH_NAKED = 22;

COLOR_SKIN = '#fec';
COLOR_SHIRT = '#753';
COLOR_LEGS = '#666';
COLOR_ARMORED_ARM = '#666';
COLOR_ARMOR = '#ccc';
COLOR_WOOD = 'brown';

CanvasRenderingContext2D.prototype.renderSword = function() {
    this.wrap(() => {
        this.fillStyle = this.resolveColor('#444');
        this.fillRect(-10, -2, 20, 4);
        this.fillRect(-3, 0, 6, 12);

        this.fillStyle = this.resolveColor('#fff');
        this.beginPath();
        this.moveTo(-3, 0);
        this.lineTo(-5, -35);
        this.lineTo(0, -40);
        this.lineTo(5, -35);
        this.lineTo(3, 0);
        this.fill();
    });
};

CanvasRenderingContext2D.prototype.renderShield = function() {
    this.wrap(() => {
        this.fillStyle = this.resolveColor('#fff');

        for (const [scale, col] of [[0.8, this.resolveColor('#fff')], [0.6, this.resolveColor('#888')]]) {
            this.fillStyle = col;
            this.scale(scale, scale);
            this.beginPath();
            this.moveTo(0, -15);
            this.lineTo(15, -10);
            this.lineTo(12, 10);
            this.lineTo(0, 25);
            this.lineTo(-12, 10);
            this.lineTo(-15, -10);
            this.fill();
        }
    });
};

CanvasRenderingContext2D.prototype.renderLegs = function(entity, color) {
    this.wrap(() => {
        const { age } = entity;

        // Left leg
        this.wrap(() => {
            this.translate(0, -32);

            this.fillStyle = this.resolveColor(color);
            this.translate(-6, 15);
            if (entity.controls.force) this.rotate(-sin(age * TWO_PI * 4) * PI / 16);
            this.fillRect(-4, 0, 8, 20);
        });

        // Right leg
        this.wrap(() => {
            this.translate(0, -32);

            this.fillStyle = this.resolveColor(color);
            this.translate(6, 15);
            if (entity.controls.force) this.rotate(sin(age * TWO_PI * 4) * PI / 16);
            this.fillRect(-4, 0, 8, 20);
        });
    });
};

CanvasRenderingContext2D.prototype.renderChest = function(entity, color, width = 25) {
    this.wrap(() => {
        const { renderAge } = entity;

        this.translate(0, -32);

        this.fillStyle = this.resolveColor(color);
        if (entity.controls.force) this.rotate(-sin(renderAge * TWO_PI * 4) * PI / 64);
        this.fillRect(-width / 2, -15, width, 30);
    });
}

CanvasRenderingContext2D.prototype.renderHead = function(entity, color, slitColor = null) {
    this.wrap(() => {
        const { renderAge } = entity;

        this.fillStyle = this.resolveColor(color);
        this.translate(0, -54);
        if (entity.controls.force) this.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
        this.fillRect(-6, -7, 12, 15);

        this.fillStyle = this.resolveColor(slitColor);
        if (slitColor) this.fillRect(4, -5, -6, 4);
    });
}

CanvasRenderingContext2D.prototype.renderStick = function() {
    this.fillStyle = this.resolveColor('#444');
    this.fillRect(-3, 10, 6, -40);
}

CanvasRenderingContext2D.prototype.renderArm = function(entity, color, renderTool) {
    this.wrap(() => {
        if (!entity.health) return;

        const { renderAge } = entity;

        this.translate(0, -32);
        
        this.fillStyle = this.resolveColor(color);
        this.translate(12, -10);
        if (entity.controls.force) this.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
        this.rotate(entity.stateMachine.state.swordRaiseRatio * PI / 2);

        this.fillRect(0, -3, 20, 6);

        this.translate(18, -6);
        renderTool();
    });
}

CanvasRenderingContext2D.prototype.renderArmAndShield = function(entity) {
    this.wrap(() => {
        const { renderAge } = entity;

        this.translate(0, -32);

        this.fillStyle = this.resolveColor('#666');
        this.translate(-10, -8);
        if (entity.controls.force) this.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
        this.rotate(Math.PI / 3);
        this.rotate(entity.stateMachine.state.shieldRaiseRatio * -PI / 3);

        const armLength = 10 + 15 * entity.stateMachine.state.shieldRaiseRatio;
        this.fillRect(0, -3, armLength, 6);

        // Shield
        this.wrap(() => {
            this.translate(armLength, 0);
            this.renderShield();
        });
    });
};

CanvasRenderingContext2D.prototype.renderExhaustion = function(entity, y) {
    if (!entity.health) return;

    if (entity.stateMachine.state.exhausted) {
        this.wrap(() => {
            this.translate(0, y);
            this.fillStyle = this.resolveColor('#ff0');
            for (let r = 0 ; r < 1 ; r += 0.15) {
                const angle = r * TWO_PI + entity.age * PI;
                this.fillRect(cos(angle) * 15, sin(angle) * 15 * 0.5, 4, 4);
            }
        });
    }
};

CanvasRenderingContext2D.prototype.renderAttackIndicator = function(entity) {
    this.wrap(() => {
        if (!entity.health) return;

        const progress = entity.stateMachine.state.attackPreparationRatio;
        if (progress > 0 && !this.isShadow) {
            this.strokeStyle = 'rgba(255,0,0,1)';
            this.fillStyle = 'rgba(255,0,0,.5)';
            this.globalAlpha = 0.5 * (1 - progress);
            this.lineWidth = 10;
            this.beginPath();
            this.scale(1 - progress, 1 - progress);
            this.ellipse(0, 0, entity.strikeRadiusX, entity.strikeRadiusY, 0, 0, TWO_PI);
            this.fill();
            this.stroke();
        }
    });
};

CanvasRenderingContext2D.prototype.renderExclamation = function(entity) {
    this.wrap(() => {
        if (!entity.health) return;

        this.translate(0, -100 + pick([-2, 2]));

        if (entity.stateMachine.state.attackPreparationRatio > 0 && !this.isShadow) {
            const progress = min(1, 2 * entity.stateMachine.state.age / 0.25);
            this.scale(progress, progress);
            this.drawImage(exclamation, -exclamation.width / 2, -exclamation.height / 2);
        }
    });
};
