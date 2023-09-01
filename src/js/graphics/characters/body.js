canvasPrototype.renderSword = function() {
    with (this) wrap(() => {
        fillStyle = resolveColor('#444');
        fillRect(-10, -2, 20, 4);
        fillRect(-3, 0, 6, 12);

        fillStyle = resolveColor('#fff');
        beginPath();
        moveTo(-3, 0);
        lineTo(-5, -35);
        lineTo(0, -40);
        lineTo(5, -35);
        lineTo(3, 0);
        fill();
    });
};

canvasPrototype.renderAxe = function() {
    with (this) wrap(() => {
        fillStyle = resolveColor(COLOR_WOOD);
        fillRect(-2, 12, 4, -40);

        translate(0, -20);

        const radius = 10;

        fillStyle = resolveColor('#eee');

        beginPath();
        arc(0, 0, radius, -PI / 4, PI / 4);
        arc(0, radius * hypot(1, 1), radius, -PI / 4, -PI * 3 / 4, true);
        arc(0, 0, radius, PI * 3 / 4, -PI * 3 / 4);
        arc(0, -radius * hypot(1, 1), radius, PI * 3 / 4, PI / 4, true);
        fill();
    });
};

canvasPrototype.renderShield = function() {
    with (this) wrap(() => {
        fillStyle = resolveColor('#fff');

        for (const [bitScale, col] of [[0.8, resolveColor('#fff')], [0.6, resolveColor('#888')]]) {
            fillStyle = col;
            scale(bitScale, bitScale);
            beginPath();
            moveTo(0, -15);
            lineTo(15, -10);
            lineTo(12, 10);
            lineTo(0, 25);
            lineTo(-12, 10);
            lineTo(-15, -10);
            fill();
        }
    });
};

canvasPrototype.renderLegs = function(entity, color) {
    with (this) wrap(() => {
        const { age } = entity;

        translate(0, -32);

        // Left leg
        wrap(() => {
            fillStyle = resolveColor(color);
            translate(-6, 12);
            if (entity.controls.force) rotate(-sin(age * TWO_PI * 4) * PI / 16);
            fillRect(-4, 0, 8, 20);
        });

        // Right leg
        wrap(() => {
            fillStyle = resolveColor(color);
            translate(6, 12);
            if (entity.controls.force) rotate(sin(age * TWO_PI * 4) * PI / 16);
            fillRect(-4, 0, 8, 20);
        });
    });
};

canvasPrototype.renderChest = function(entity, color, width = 25) {
    with (this) wrap(() => {
        const { renderAge } = entity;

        translate(0, -32);

        // Breathing
        translate(0, sin(renderAge * TWO_PI / 5) * 0.5);
        rotate(sin(renderAge * TWO_PI / 5) * PI / 128);

        fillStyle = resolveColor(color);
        if (entity.controls.force) rotate(-sin(renderAge * TWO_PI * 4) * PI / 64);
        fillRect(-width / 2, -15, width, 30);
    });
}

canvasPrototype.renderHead = function(entity, color, slitColor = null) {
    with (this) wrap(() => {
        const { renderAge } = entity;

        fillStyle = resolveColor(color);
        translate(0, -54);
        if (entity.controls.force) rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
        fillRect(-6, -7, 12, 15);

        fillStyle = resolveColor(slitColor);
        if (slitColor) fillRect(4, -5, -6, 4);
    });
}

canvasPrototype.renderCrown = function(entity) {
    with (this) wrap(() => {
        fillStyle = resolveColor('#ff0');
        translate(0, -70);

        beginPath();
        lineTo(-8, 0);
        lineTo(-4, 6);
        lineTo(0, 0);
        lineTo(4, 6);
        lineTo(8, 0);
        lineTo(8, 12);
        lineTo(-8, 12);
        fill();
    });
}

canvasPrototype.renderStick = function() {
    this.fillStyle = this.resolveColor('#444');
    this.fillRect(-3, 10, 6, -40);
}

canvasPrototype.renderArm = function(entity, color, renderTool) {
    with (this) wrap(() => {
        if (!entity.health) return;

        const { renderAge } = entity;

        translate(11, -42);
        
        fillStyle = resolveColor(color);
        if (entity.controls.force) rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
        rotate(entity.stateMachine.state.swordRaiseRatio * PI / 2);

        // Breathing
        rotate(sin(renderAge * TWO_PI / 5) * PI / 32);

        fillRect(0, -3, 20, 6);

        translate(18, -6);
        renderTool();
    });
}

canvasPrototype.renderArmAndShield = function(entity, armColor) {
    with (this) wrap(() => {
        const { renderAge } = entity;

        translate(0, -32);

        fillStyle = resolveColor(armColor);
        translate(-10, -8);
        if (entity.controls.force) rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
        rotate(PI / 3);
        rotate(entity.stateMachine.state.shieldRaiseRatio * -PI / 3);

        // Breathing
        rotate(sin(renderAge * TWO_PI / 5) * PI / 64);

        const armLength = 10 + 15 * entity.stateMachine.state.shieldRaiseRatio;
        fillRect(0, -3, armLength, 6);

        // Shield
        wrap(() => {
            translate(armLength, 0);
            renderShield();
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
    if (RENDER_SCREENSHOT) return;

    with (this) wrap(() => {
        if (!entity.health) return;

        const progress = entity.stateMachine.state.attackPreparationRatio;
        if (progress > 0 && !this.isShadow) {
            strokeStyle = 'rgba(255,0,0,1)';
            fillStyle = 'rgba(255,0,0,.5)';
            globalAlpha = interpolate(0.5, 0, progress);
            lineWidth = 10;
            beginPath();
            scale(1 - progress, 1 - progress);
            ellipse(0, 0, entity.strikeRadiusX, entity.strikeRadiusY, 0, 0, TWO_PI);
            fill();
            stroke();
        }
    });
};

canvasPrototype.renderExclamation = function(entity) {
    with (this) wrap(() => {
        if (!entity.health) return;

        translate(0, -100 + pick([-2, 2]));

        if (entity.stateMachine.state.attackPreparationRatio > 0 && !isShadow) {
            const progress = min(1, 2 * entity.stateMachine.state.age / 0.25);
            scale(progress, progress);
            drawImage(exclamation, -exclamation.width / 2, -exclamation.height / 2);
        }
    });
};
