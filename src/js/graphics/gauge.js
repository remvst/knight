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
    constructor(getValue) {
        this.getValue = getValue;
        this.value = this.displayedValue = 1;
        this.regenRate = 0.5;
    }

    cycle(elapsed) {
        this.displayedValue += between(
            -elapsed * 0.5, 
            this.getValue() - this.displayedValue, 
            elapsed * this.regenRate,
        );
    }

    render(width, height, color, half, ridgeCount) {
        function renderGauge(
            width,
            height, 
            value,
            color,
        ) {
            ctx.wrap(() => {
                const displayedMaxX = interpolate(height / 2, width, value);
                if (value === 0) return;

                ctx.translate(-width / 2, 0);

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.lineTo(0, height / 2);

                if (!half) {
                    ctx.lineTo(height / 2, 0);
                    ctx.lineTo(displayedMaxX - height / 2, 0);
                }

                ctx.lineTo(displayedMaxX, height / 2);
                ctx.lineTo(displayedMaxX - height / 2, height);
                ctx.lineTo(height / 2, height);
                ctx.fill();
            })
        }

        ctx.wrap(() => {
            ctx.wrap(() => {
                ctx.globalAlpha *= 0.5;
                renderGauge(width + 8, height + 4, 1, '#000');
            });

            ctx.translate(0, 2);
            renderGauge(width, height, this.displayedValue, '#fff');
            renderGauge(width, height, min(this.displayedValue, this.getValue()), color);

            ctx.globalAlpha *= 0.5;
            ctx.fillStyle = '#000';
            for (const r = 1 / ridgeCount ; r < 1 ; r += 1 / ridgeCount) {
                ctx.fillRect(r * width - width / 2, 0, 1, height);
            }
        });
    }
}
