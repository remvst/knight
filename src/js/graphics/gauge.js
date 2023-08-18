class Gauge {
    constructor(character) {
        this.character = character;

        this.displayedHealth = 1;
        this.displayedStamina = 1;
    }

    cycle(elapsed) {
        this.displayedHealth += between(-elapsed * 0.5, this.character.health - this.displayedHealth, elapsed * 0.5);
        this.displayedStamina += between(-elapsed * 0.5, this.character.stamina - this.displayedStamina, elapsed * 0.5);
    }

    render(x, y, width, height, character) {
        ctx.translate(x, y);

        // Background      
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width - height / 2, height);
        ctx.lineTo(0, height);
        ctx.fill();

        ctx.wrap(() => {
            ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0;
            ctx.clip();

            // Health change
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, width * this.displayedHealth, height * 0.8 - 2);

            // Actual health
            ctx.fillStyle = '#900';
            ctx.fillRect(0, 0, width * this.character.health, height * 0.8 - 2);

            // Stamina change
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, height, width * this.displayedStamina, height * -0.2);

            // Actual stamina
            ctx.fillStyle = '#0ef';
            ctx.fillRect(0, height, width * this.character.stamina, height * -0.2);
        });

        ctx.shadowOffsetX = ctx.shadowOffsetY = 2 * height / 30;
        ctx.shadowBlur = 0;
        ctx.translate(0, (height - 10) / 2);
        ctx.scale(height / 30, height / 30);
        ctx.scale(1.5, 1.5);
        ctx.renderShield();
    }
}
