Object
    .getOwnPropertyNames(canvasPrototype)
    .forEach(key => {
        try {
            if (canvasPrototype[key].call) {
                w[key] = function() {
                    ctx[key].apply(ctx, arguments);
                }
            }
            return;
        } catch (e) {}
        
        Object.defineProperty(w, key, {
            get() { return ctx[key]; },
            set(newValue) { ctx[key] = newValue; }
        });
    });
