CanvasRenderingContext2D.prototype.renderLargeText = function (bits) {
    this.textBaseline = 'alphabetic';
    this.textAlign = 'left';
    this.fillStyle = LOGO_GRADIENT;
    this.strokeStyle = '#000';
    this.lineWidth = 4;
    this.shadowColor = '#000';

    let x = 0;
    for (const [text, size, offsetWidth] of bits) {
        this.font = size + nomangle('px Times New Roman');
        x += this.measureText(text).width + (offsetWidth || 0);
    }

    this.translate(-x / 2, 0);

    x = 0;
    for (const [text, size, offsetWidth] of bits) {
        this.font = size + nomangle('px Times New Roman');

        this.shadowBlur = 5;
        this.strokeText(text, x, 0);

        this.shadowBlur = 0;
        this.fillText(text, x, 0);

        x += this.measureText(text).width + (offsetWidth || 0);
    }

    return x;
};

CanvasRenderingContext2D.prototype.renderInstruction = function(text) {
    this.textBaseline = nomangle('middle');
    this.textAlign = nomangle('center');
    this.strokeStyle = '#000';
    this.lineWidth = 4;
    this.font = nomangle('18pt Times New Roman');

    const width = this.measureText(text).width + 20;
    this.fillStyle = 'rgba(0,0,0,.5)';
    this.fillRect(-width / 2, 0, width, 40);

    this.fillStyle = '#fff';
    this.strokeText(text, 0, 20);
    this.fillText(text, 0, 20);
};
