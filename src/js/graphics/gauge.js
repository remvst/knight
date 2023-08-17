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

    render(x, y, width, height) {
        ctx.translate(x, y);

        // Background
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.fillRect(0, 0, width, height);

        ctx.shadowOffsetX = ctx.shadowOffsetY = 0;

        // Health change
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width * this.displayedHealth, height * 0.8);

        // Actual health
        ctx.fillStyle = '#900';
        ctx.fillRect(0, 0, width * this.character.health, height * 0.8);

        // Stamina change
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, height, width * this.displayedStamina, height * -0.2);

        // Actual stamina
        ctx.fillStyle = '#0ef';
        ctx.fillRect(0, height, width * this.character.stamina, height * -0.2);
    }
}
