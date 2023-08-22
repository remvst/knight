healthGradient = createCanvas(400, 1, (ctx) => {
    const grad = ctx.createLinearGradient(-200, 0, 200, 0);
    grad.addColorStop(0, '#900');
    grad.addColorStop(1, '#f44');
    return grad;
});

staminaGradient = createCanvas(400, 1, (ctx) => {
    const grad = ctx.createLinearGradient(-200, 0, 200, 0);
    grad.addColorStop(0, '#07f');
    grad.addColorStop(1, '#0ef');
    return grad;
});

class Gauge {
    constructor(character) {
        this.character = character;

        this.displayedHealth = 1;
        this.displayedStamina = 1;
    }

    cycle(elapsed) {
        this.displayedHealth += between(-elapsed * 0.5, (this.character.health / this.character.maxHealth) - this.displayedHealth, elapsed * 0.5);
        this.displayedStamina += between(-elapsed * 0.5, this.character.stamina - this.displayedStamina, elapsed * 0.5);
    }

    render(width, height) {
        function renderStuff(
            width,
            height, 
            value,
            color,
        ) {
            const displayedMaxX = interpolate(-width / 2 + height / 2, width / 2, value);
            if (value === 0) return;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(-width / 2, 0);
            ctx.lineTo(displayedMaxX, 0);
            ctx.lineTo(displayedMaxX - height / 2, height);
            ctx.lineTo(-width / 2 + height / 2, height);
            ctx.fill();
        }

        ctx.wrap(() => {
            renderStuff(width + 8, height + 4, 1, '#000');
            ctx.translate(0, 2);
            renderStuff(width, height, this.displayedHealth, '#fff');
            renderStuff(width, height, this.character.health / this.character.maxHealth, healthGradient);
        });

        ctx.translate(0, height + 2);
        ctx.shadowBlur = 0;

        ctx.wrap(() => {
            const staminaWidth = width * 0.75;
            const staminaHeight = height * 0.25;
            renderStuff(staminaWidth + 8, staminaHeight + 4, 1, '#000');
            ctx.translate(0, 2);
            renderStuff(staminaWidth, staminaHeight, this.displayedStamina, '#fff');
            renderStuff(staminaWidth, staminaHeight, this.character.stamina, staminaGradient);
        });
    }
}
