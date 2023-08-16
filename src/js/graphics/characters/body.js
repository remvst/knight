renderLegs = (entity, color) => {
    const renderAge = entity.age * (entity.inWater ? 0.5 : 1);

    // Left leg
    ctx.wrap(() => {
        ctx.translate(0, -32);

        ctx.fillStyle = color(entity.getColor('#666'));
        ctx.translate(-6, 15);
        if (entity.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 16);
        ctx.fillRect(-4, 0, 8, 20);
    });

    // Right leg
    ctx.wrap(() => {
        ctx.translate(0, -32);

        ctx.fillStyle = color(entity.getColor('#666'));
        ctx.translate(6, 15);
        if (entity.controls.force) ctx.rotate(sin(renderAge * TWO_PI * 4) * PI / 16);
        ctx.fillRect(-4, 0, 8, 20);
    });
};

renderChest = (entity, color) => {
    const renderAge = entity.age * (entity.inWater ? 0.5 : 1);

    ctx.scale(entity.facing, 1);
    ctx.translate(0, -32);

    ctx.fillStyle = color(entity.getColor('#ccc'));
    if (entity.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 64);
    ctx.fillRect(-12, -15, 25, 30);

    // Head
    ctx.scale(entity.facing, 1);
    ctx.fillStyle = color(entity.getColor('#fec'));
    ctx.translate(0, -22);
    if (entity.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
    ctx.fillRect(-6, -7, 12, 15);
};

renderNakedChest = (entity, color) => {
    const renderAge = entity.age * (entity.inWater ? 0.5 : 1);

    ctx.scale(entity.facing, 1);
    ctx.translate(0, -32);

    ctx.fillStyle = color(entity.getColor('#753'));
    if (entity.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 64);
    ctx.fillRect(-12, -15, 25, 30);

    // Head
    ctx.fillStyle = color(entity.getColor('#fec'));
    ctx.scale(entity.facing, 1);
    ctx.translate(0, -22);
    if (entity.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
    ctx.fillRect(-6, -7, 12, 15);
};

renderStick = (entity, color) => {
    const renderAge = entity.age * (entity.inWater ? 0.5 : 1);

    ctx.scale(entity.facing, 1);
    ctx.translate(0, -32);
    
    ctx.fillStyle = color(entity.getColor('#fec'));
    ctx.translate(12, -10);
    if (entity.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
    ctx.rotate(entity.stateMachine.state.swordRaiseRatio * PI / 2);

    ctx.fillRect(0, -3, 20, 6);

    // Sword
    ctx.wrap(() => {
        ctx.translate(18, -6);

        ctx.fillStyle = color(entity.getColor('#444'));
        ctx.fillRect(-3, 10, 6, -40);
    });
}

renderSword = (entity, color) => {
    const renderAge = entity.age * (entity.inWater ? 0.5 : 1);

    ctx.scale(entity.facing, 1);
    ctx.translate(0, -32);
    
    ctx.fillStyle = color(entity.getColor('#666'));
    ctx.translate(12, -10);
    if (entity.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
    ctx.rotate(entity.stateMachine.state.swordRaiseRatio * PI / 2);

    ctx.fillRect(0, -3, 20, 6);

    // Sword
    ctx.wrap(() => {
        ctx.translate(18, -6);

        ctx.fillStyle = color(entity.getColor('#444'));
        ctx.fillRect(-10, -2, 20, 4);
        ctx.fillRect(-3, 0, 6, 12);

        ctx.fillStyle = color(entity.getColor('#fff'));
        ctx.beginPath();
        ctx.moveTo(-3, 0);
        ctx.lineTo(-5, -35);
        ctx.lineTo(0, -40);
        ctx.lineTo(5, -35);
        ctx.lineTo(3, 0);
        ctx.fill();
    });
}

renderShield = (entity, color) => {
    const renderAge = entity.age * (entity.inWater ? 0.5 : 1);

    ctx.scale(entity.facing, 1);
    ctx.translate(0, -32);

    ctx.fillStyle = color(entity.getColor('#666'));
    ctx.translate(-10, -8);
    if (entity.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
    ctx.rotate(Math.PI / 3);
    ctx.rotate(entity.stateMachine.state.shieldRaiseRatio * -PI / 3);

    const armLength = 10 + 15 * entity.stateMachine.state.shieldRaiseRatio;
    ctx.fillRect(0, -3, armLength, 6);

    // Shield
    ctx.wrap(() => {
        ctx.translate(armLength, 0);

        if (!entity.shielding) ctx.rotate(-Math.PI / 4);

        ctx.fillStyle = color(entity.getColor('#fff'));

        for (const [scale, col] of [[0.8, color(entity.getColor('#fff'))], [0.6, color(entity.getColor('#888'))]]) {
            ctx.fillStyle = col;
            ctx.scale(scale, scale);
            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(15, -10);
            ctx.lineTo(12, 10);
            ctx.lineTo(0, 25);
            ctx.lineTo(-12, 10);
            ctx.lineTo(-15, -10);
            ctx.fill();
        }
    });
};

renderExhaustion = (entity, color, shadow, y) => {
    if (entity.stateMachine.state.exhausted) {
        ctx.wrap(() => {
            ctx.translate(0, y);
            ctx.fillStyle = color('#ff0');
            for (let r = 0 ; r < 1 ; r += 0.15) {
                const angle = r * TWO_PI + entity.age * PI;
                ctx.fillRect(cos(angle) * 15, sin(angle) * 15 * 0.5, 4, 4);
            }
        });
    }
};

renderAttackIndicator = (entity, color, shadow) => {
    const progress = (entity.stateMachine.state.attackPreparationRatio);
    if (progress > 0 && !shadow) {
        ctx.strokeStyle = 'rgba(255,255,0,1)';
        ctx.fillStyle = 'rgba(255,255,0,.5)';
        ctx.globalAlpha = 0.5 * (1 - progress);
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.scale(1 - progress, 1 - progress);
        ctx.ellipse(0, 0, entity.strikeRadiusX, entity.strikeRadiusY, 0, 0, TWO_PI);
        ctx.fill();
        ctx.stroke();
    }
};

renderExclamation = (entity, color, shadow) => {
    ctx.translate(0, -100 + pick([-2, 2]));

    if (entity.stateMachine.state.attackPreparationRatio > 0 && !shadow) {
        const progress = min(1, 2 * entity.stateMachine.state.age / 0.25);
        ctx.scale(progress, progress);
        ctx.drawImage(exclamation, -exclamation.width / 2, -exclamation.height / 2);
    }
};
