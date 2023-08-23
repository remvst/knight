class MobileJoystick {
    constructor() {
        this.x = this.y = 0;
        this.touch = {'x': 0, 'y': 0};
        this.touchIdentifier = -1;
    }

    render() {
        if (this.touchIdentifier < 0) return;

        const extraForceRatio = between(0, (dist(this, this.touch) - TOUCH_JOYSTICK_RADIUS) / (TOUCH_JOYSTICK_MAX_RADIUS - TOUCH_JOYSTICK_RADIUS), 1);
        const radius = (1 - extraForceRatio) * TOUCH_JOYSTICK_RADIUS;

        TOUCH_CONTROLS_CTX.globalAlpha = interpolate(0.5, 0, extraForceRatio);
        TOUCH_CONTROLS_CTX.strokeStyle = '#fff';
        TOUCH_CONTROLS_CTX.lineWidth = 2;
        TOUCH_CONTROLS_CTX.fillStyle = 'rgba(0,0,0,0.5)';
        TOUCH_CONTROLS_CTX.beginPath();
        TOUCH_CONTROLS_CTX.arc(this.x, this.y, radius, 0, TWO_PI);
        TOUCH_CONTROLS_CTX.fill();
        TOUCH_CONTROLS_CTX.stroke();

        TOUCH_CONTROLS_CTX.globalAlpha = 0.5;
        TOUCH_CONTROLS_CTX.fillStyle = '#fff';
        TOUCH_CONTROLS_CTX.beginPath();
        TOUCH_CONTROLS_CTX.arc(this.touch.x, this.touch.y, 30, 0, TWO_PI);
        TOUCH_CONTROLS_CTX.fill();
    }
}

class MobileButton {
    constructor(
        x, 
        y,
        label,
    ) {
        this.x = x; 
        this.y = y;
        this.label = label;
    }

    render() {
        TOUCH_CONTROLS_CTX.translate(this.x(), this.y());

        TOUCH_CONTROLS_CTX.strokeStyle = '#fff';
        TOUCH_CONTROLS_CTX.lineWidth = 2;
        TOUCH_CONTROLS_CTX.fillStyle = this.down ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
        TOUCH_CONTROLS_CTX.beginPath();
        TOUCH_CONTROLS_CTX.arc(0, 0, TOUCH_BUTTON_RADIUS, 0, TWO_PI);
        TOUCH_CONTROLS_CTX.fill();
        TOUCH_CONTROLS_CTX.stroke();

        TOUCH_CONTROLS_CTX.font = nomangle('16pt Courier');
        TOUCH_CONTROLS_CTX.textAlign = nomangle('center');
        TOUCH_CONTROLS_CTX.textBaseline = nomangle('middle');
        TOUCH_CONTROLS_CTX.fillStyle = '#fff';
        TOUCH_CONTROLS_CTX.fillText(this.label, 0, 0);
    }
}

updateTouches = (touches) => {
    for (const button of TOUCH_BUTTONS) {
        button.down = false;
        for (const touch of touches) {
            if (
                abs(button.x() - touch.pageX) < TOUCH_BUTTON_RADIUS &&
                abs(button.y() - touch.pageY) < TOUCH_BUTTON_RADIUS
            ) {
                button.down = true;
            }
        }
    }

    let movementTouch;
    for (const touch of touches) {
        if (
            touch.identifier === TOUCH_JOYSTICK.touchIdentifier || 
            touch.pageX < innerWidth / 2
        ) {
            movementTouch = touch;
            break;
        }
    }

    if (movementTouch) {
        if (TOUCH_JOYSTICK.touchIdentifier < 0) {
            TOUCH_JOYSTICK.x = movementTouch.pageX;
            TOUCH_JOYSTICK.y = movementTouch.pageY;
        }
        TOUCH_JOYSTICK.touchIdentifier = movementTouch.identifier;
        TOUCH_JOYSTICK.touch.x = movementTouch.pageX;
        TOUCH_JOYSTICK.touch.y = movementTouch.pageY;
    } else {
        TOUCH_JOYSTICK.touchIdentifier = -1;
    }
};

ontouchstart = (event) => {
    inputMode = INPUT_MODE_TOUCH;
    event.preventDefault();
    updateTouches(event.touches);
};

ontouchmove = (event) => {
    event.preventDefault();
    updateTouches(event.touches);
};

ontouchend = (event) => {
    event.preventDefault();
    updateTouches(event.touches);
};

renderTouchControls = () => {
    TOUCH_CONTROLS_CANVAS.style.display = inputMode == INPUT_MODE_TOUCH ? 'block' : 'hidden';
    TOUCH_CONTROLS_CANVAS.width = innerWidth;
    TOUCH_CONTROLS_CANVAS.height = innerHeight;

    for (const button of TOUCH_BUTTONS.concat([TOUCH_JOYSTICK])) {
        TOUCH_CONTROLS_CTX.wrap(() => button.render());
    }

    requestAnimationFrame(renderTouchControls);
}

TOUCH_CONTROLS_CANVAS = document.createElement(nomangle('canvas'));
TOUCH_CONTROLS_CTX = TOUCH_CONTROLS_CANVAS.getContext('2d');

TOUCH_BUTTONS = [
    TOUCH_ATTACK_BUTTON = new MobileButton(
        () => TOUCH_CONTROLS_CANVAS.width - 175,
        () => TOUCH_CONTROLS_CANVAS.height - 75,
        nomangle('ATK'),
    ),
    TOUCH_SHIELD_BUTTON = new MobileButton(
        () => TOUCH_CONTROLS_CANVAS.width - 75,
        () => TOUCH_CONTROLS_CANVAS.height - 75,
        nomangle('DEF'),
    ),
    TOUCH_DASH_BUTTON = new MobileButton(
        () => TOUCH_CONTROLS_CANVAS.width - 125,
        () => TOUCH_CONTROLS_CANVAS.height - 150,
        nomangle('ROLL'),
    ),
];

TOUCH_JOYSTICK = new MobileJoystick();

if (inputMode === INPUT_MODE_TOUCH) {
    document.body.appendChild(TOUCH_CONTROLS_CANVAS);
    renderTouchControls();
}
