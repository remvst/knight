createCanvas = (w, h, render) => {
    const can = document.createElement('canvas');
    can.width = w;
    can.height = h;

    const ctx = can.getContext('2d');

    return render(ctx, can) || can;
};

canvasPrototype.slice = (radius, sliceUp, ratio) => {
    ctx.beginPath();
    if (sliceUp) {
        ctx.moveTo(-radius, -radius);
        ctx.lineTo(radius, -radius);
    } else {
        ctx.lineTo(-radius, radius);
        ctx.lineTo(radius, radius);
    }

    ctx.lineTo(radius, -radius * ratio);
    ctx.lineTo(-radius, radius * ratio);
    ctx.clip();
};
