canvasPrototype.resolveColor = x => x;

canvasPrototype.withShadow = function(render) {
    wrap(() => {
        this.isShadow = true;
        this.resolveColor = () => 'rgba(0,0,0,0.2)';

        scale(1, 0.5);
        transform(1, 0, 0.5, 1, 0, 0); // shear the context
        render();
    });

    wrap(() => {
        this.isShadow = false;
        render();
    });
};
