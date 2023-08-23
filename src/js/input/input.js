mouseUpdate = () => {
    fastForward = DOWN[70];

    if (player) {
        player.target.x = mousePosition.x + camera.x;
        player.target.y = mousePosition.y + camera.y;
        player.movementPower = mouseDown ? 1 : 1 / 4;
    }
};

touchUpdate = () => {
    fastForward = false;

    if (player) {
        if (!hasTouchDown) {
            player.target.x = player.head.position.x;
            player.target.y = player.head.position.y;
        } else {
            tapePlaying = true;

            const angle = angleBetween(touchStartPosition, touchPosition);
            let force = dist(touchStartPosition, touchPosition) / TOUCH_JOYSTICK_MAX_RADIUS;
            if (force < 0.2) force = 0;

            player.target.x = player.head.position.x + cos(angle) * 100;
            player.target.y = player.head.position.y + sin(angle) * 100;

            player.movementPower = force;
        }
    }
};

gamepadUpdate = () => {
    for (const gamepad of navigator.getGamepads()) {
        if (gamepad) {
            const angle = atan2(gamepad.axes[1], gamepad.axes[0]);
            let force = distP(0, 0, gamepad.axes[0], gamepad.axes[1]) * 1 / 4;

            if (force < 0.2) {
                force = 0;
            } else if (gamepad.buttons[0] && gamepad.buttons[0].pressed) {
                force = 1;
            }

            if (player) {
                player.target.x = player.head.position.x + cos(angle) * 100;
                player.target.y = player.head.position.y + sin(angle) * 100;
                player.movementPower = force;
            }

            tapePlaying = tapePlaying || gamepad.buttons[0] && gamepad.buttons[0].pressed;
            fastForward = gamepad.buttons[3] && gamepad.buttons[3].pressed;
        }
    }
};

maybeSwitchToGamepad = () => {
    hasGamepad = false;

    if (!navigator.getGamepads || inputMode === INPUT_MODE_GAMEPAD) {
        return;
    }

    for (const gamepad of navigator.getGamepads()) {
        if (!gamepad) {
            continue;
        }

        hasGamepad = true;

        for (const button of gamepad.buttons) {
            if (button.pressed) {
                inputMode = INPUT_MODE_GAMEPAD;
                return;
            }
        }
        for (const axis of gamepad.axes) {
            if (abs(axis) > 0.5) {
                inputMode = INPUT_MODE_GAMEPAD;
                return;
            }
        }
    }
}

updateControls = () => {
    maybeSwitchToGamepad();

    mapInput(
        mouseUpdate,
        touchUpdate,
        gamepadUpdate
    )();
};

mapInput = (
    mouseParam,
    touchParam,
    gamepadParam,
) => {
    switch (inputMode) {
    case INPUT_MODE_MOUSE: return mouseParam;
    case INPUT_MODE_TOUCH: return touchParam;
    case INPUT_MODE_GAMEPAD: return gamepadParam;
    }
};
