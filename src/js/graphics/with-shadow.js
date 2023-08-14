CanvasRenderingContext2D.prototype.withShadow = function(doRender) {
    this.wrap(() => {
        ctx.scale(1, 0.5);
        ctx.transform(1, 0, 0.5, 1, 0, 0); // shear the context
        doRender(() => 'rgba(0,0,0,0.3)');
    });

    this.wrap(() => {
        doRender((color) => color);
    });
};
