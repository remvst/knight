canvasPrototype.wrap = function(f) {
    const { resolveColor } = this;
    save();
    f();
    restore();
    this.resolveColor = resolveColor || (x => x);
};
