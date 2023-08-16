CanvasRenderingContext2D.prototype.withShadow = function(render) {
    this.wrap(() => {
        this.isShadow = true;
        this.resolveColor = () => 'rgba(0,0,0,0.2)';

        ctx.scale(1, 0.5);
        ctx.transform(1, 0, 0.5, 1, 0, 0); // shear the context
        render(() => 'rgba(0,0,0,0.2)', true);
    });

    this.wrap(() => {
        this.isShadow = false;
        this.resolveColor = x => x;

        render((color) => color, false);
    });
};
