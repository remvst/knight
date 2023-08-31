const DOWN = {};
onkeydown = e => {
    if (e.keyCode == 27 || e.keyCode == 80) {
        GAME_PAUSED = !GAME_PAUSED;
        setSongVolume(GAME_PAUSED ? 0 : SONG_VOLUME);
    }
    DOWN[e.keyCode] = true
};
onkeyup = e => DOWN[e.keyCode] = false;
