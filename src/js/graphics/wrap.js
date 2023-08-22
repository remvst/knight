canvasPrototype.wrap = function(f) {
    const { resolveColor } = this;
    this.save();
    f();
    this.restore();
    this.resolveColor = resolveColor || (x => x);
};
