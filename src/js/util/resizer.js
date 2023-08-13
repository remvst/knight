onresize = () => {
    let windowWidth = innerWidth,
        windowHeight = innerHeight,

        availableRatio = windowWidth / windowHeight, // available ratio
        canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT, // base ratio
        appliedWidth,
        appliedHeight,
        containerStyle = nomangle(t).style;

    if (availableRatio <= canvasRatio) {
        appliedWidth = windowWidth;
        appliedHeight = appliedWidth / canvasRatio;
    } else {
        appliedHeight = windowHeight;
        appliedWidth = appliedHeight * canvasRatio;
    }

    containerStyle.width = appliedWidth + 'px';
    containerStyle.height = appliedHeight + 'px';
};
