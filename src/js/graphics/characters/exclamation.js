exclamation = createCanvas(50, 50, (ctx, can) => {
    ctx.fillStyle = '#fff';
    ctx.translate(can.width / 2, can.width / 2);
    for (let r = 0, i = 0 ; r < 1 ; r += 0.05, i++) {
        const distance = i % 2 ? can.width / 2 : can.width / 3;
        ctx.lineTo(
            cos(r * TWO_PI) * distance,
            sin(r * TWO_PI) * distance,
        )
    }
    ctx.fill();

    ctx.font = nomangle('bold 18pt Arial');
    ctx.fillStyle = '#f00';
    ctx.textAlign = nomangle('center');
    ctx.textBaseline = nomangle('middle');
    ctx.fillText('!!!', 0, 0);
});
