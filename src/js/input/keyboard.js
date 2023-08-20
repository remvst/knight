const DOWN = {};
onkeydown = e => {
    if (e.keyCode == 27 || e.keyCode == 80) {
        GAME_PAUSED = !GAME_PAUSED;
    }
    DOWN[e.keyCode] = true
};
onkeyup = e => DOWN[e.keyCode] = false;
