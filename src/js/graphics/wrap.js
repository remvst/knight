CanvasRenderingContext2D.prototype.wrap = function(f) {
    this.save();
    f();
    this.restore();
};
