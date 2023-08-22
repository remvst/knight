createCanvas = (w, h, render) => {
    const can = document.createElement('canvas');
    can.width = w;
    can.height = h;

    const ctx = can.getContext('2d');

    return render(ctx, can) || can;
};

canvasPrototype.slice = (radius, sliceUp, ratio) => {
    this.beginPath();
    if (sliceUp) {
        this.moveTo(-radius, -radius);
        this.lineTo(radius, -radius);
    } else {
        this.lineTo(-radius, radius);
        this.lineTo(radius, radius);
    }

    this.lineTo(radius, -radius * ratio);
    this.lineTo(-radius, radius * ratio);
    this.clip();
};
