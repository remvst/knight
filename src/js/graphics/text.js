LOGO_GRADIENT = createCanvas(1, 1, (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 0, -150);
    grad.addColorStop(0, '#888');
    grad.addColorStop(0.7, '#eee');
    grad.addColorStop(1, '#888');
    return grad;
});

canvasPrototype.renderLargeText = function (bits) {
    with (this) {
        textBaseline = nomangle('alphabetic');
        textAlign = nomangle('left');
        fillStyle = LOGO_GRADIENT;
        strokeStyle = '#000';
        lineWidth = 4;
        shadowColor = '#000';

        let x = 0;
        for (const [text, size, offsetWidth] of bits) {
            font = size + nomangle('px Times New Roman');
            x += measureText(text).width + (offsetWidth || 0);
        }

        translate(-x / 2, 0);

        x = 0;
        for (const [text, size, offsetWidth] of bits) {
            font = size + nomangle('px Times New Roman');

            shadowBlur = 5;
            strokeText(text, x, 0);

            shadowBlur = 0;
            fillText(text, x, 0);

            x += measureText(text).width + (offsetWidth || 0);
        }

        return x;
    }
};

canvasPrototype.renderInstruction = function(text) {
    with (this) {
        textBaseline = nomangle('middle');
        textAlign = nomangle('center');
        strokeStyle = '#000';
        lineWidth = 4;
        font = nomangle('18pt Times New Roman');

        const width = measureText(text).width + 20;
        fillStyle = 'rgba(0,0,0,.5)';
        fillRect(-width / 2, 0, width, 40);

        fillStyle = '#fff';
        strokeText(text, 0, 20);
        fillText(text, 0, 20);
    }
};
