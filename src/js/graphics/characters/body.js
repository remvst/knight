canvasPrototype.renderSword = function() {
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

canvasPrototype.renderAxe = function() {
    this.wrap(() => {
        this.fillStyle = this.resolveColor(COLOR_WOOD);
        this.fillRect(-2, 12, 4, -40);

        this.translate(0, -20);

        const radius = 10;

        this.fillStyle = this.resolveColor('#eee');

        this.beginPath();
        this.arc(0, 0, radius, -PI / 4, PI / 4);
        this.arc(0, radius * hypot(1, 1), radius, -PI / 4, -PI * 3 / 4, true);
        this.arc(0, 0, radius, PI * 3 / 4, -PI * 3 / 4);
        this.arc(0, -radius * hypot(1, 1), radius, PI * 3 / 4, PI / 4, true);
        this.fill();
    });
};

canvasPrototype.renderShield = function() {
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

canvasPrototype.renderLegs = function(entity, color) {
    this.wrap(() => {
        const { age } = entity;

        // Left leg
        this.wrap(() => {
            this.translate(0, -32);

            this.fillStyle = this.resolveColor(color);
            this.translate(-6, 12);
            if (entity.controls.force) this.rotate(-sin(age * TWO_PI * 4) * PI / 16);
            this.fillRect(-4, 0, 8, 20);
        });

        // Right leg
        this.wrap(() => {
            this.translate(0, -32);

            this.fillStyle = this.resolveColor(color);
            this.translate(6, 12);
            if (entity.controls.force) this.rotate(sin(age * TWO_PI * 4) * PI / 16);
            this.fillRect(-4, 0, 8, 20);
        });
    });
};

canvasPrototype.renderChest = function(entity, color, width = 25) {
    this.wrap(() => {
        const { renderAge } = entity;

        this.translate(0, -32);

        // Breathing
        this.translate(0, sin(renderAge * TWO_PI / 5) * 0.5);
        this.rotate(sin(renderAge * TWO_PI / 5) * PI / 128);

        this.fillStyle = this.resolveColor(color);
        if (entity.controls.force) this.rotate(-sin(renderAge * TWO_PI * 4) * PI / 64);
        this.fillRect(-width / 2, -15, width, 30);
    });
}

canvasPrototype.renderHead = function(entity, color, slitColor = null) {
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

canvasPrototype.renderStick = function() {
    this.fillStyle = this.resolveColor('#444');
    this.fillRect(-3, 10, 6, -40);
}

canvasPrototype.renderArm = function(entity, color, renderTool) {
    this.wrap(() => {
        if (!entity.health) return;

        const { renderAge } = entity;

        this.translate(11, -42);
        
        this.fillStyle = this.resolveColor(color);
        if (entity.controls.force) this.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
        this.rotate(entity.stateMachine.state.swordRaiseRatio * PI / 2);

        // Breathing
        this.rotate(sin(renderAge * TWO_PI / 5) * PI / 32);

        this.fillRect(0, -3, 20, 6);

        this.translate(18, -6);
        renderTool();
    });
}

canvasPrototype.renderArmAndShield = function(entity, armColor) {
    this.wrap(() => {
        const { renderAge } = entity;

        this.translate(0, -32);

        this.fillStyle = this.resolveColor(armColor);
        this.translate(-10, -8);
        if (entity.controls.force) this.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
        this.rotate(Math.PI / 3);
        this.rotate(entity.stateMachine.state.shieldRaiseRatio * -PI / 3);

        // Breathing
        this.rotate(sin(renderAge * TWO_PI / 5) * PI / 64);

        const armLength = 10 + 15 * entity.stateMachine.state.shieldRaiseRatio;
        this.fillRect(0, -3, armLength, 6);

        // Shield
        this.wrap(() => {
            this.translate(armLength, 0);
            this.renderShield();
        });
    });
};

canvasPrototype.renderExhaustion = function(entity, y) {
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

canvasPrototype.renderAttackIndicator = function(entity) {
    this.wrap(() => {
        if (!entity.health) return;

        const progress = entity.stateMachine.state.attackPreparationRatio;
        if (progress > 0 && !this.isShadow) {
            this.strokeStyle = 'rgba(255,0,0,1)';
            this.fillStyle = 'rgba(255,0,0,.5)';
            this.globalAlpha = interpolate(0.5, 0, progress);
            this.lineWidth = 10;
            this.beginPath();
            this.scale(1 - progress, 1 - progress);
            this.ellipse(0, 0, entity.strikeRadiusX, entity.strikeRadiusY, 0, 0, TWO_PI);
            this.fill();
            this.stroke();
        }
    });
};

canvasPrototype.renderExclamation = function(entity) {
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
