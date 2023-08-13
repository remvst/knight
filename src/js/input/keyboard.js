const DOWN = {};
onkeydown = e => DOWN[e.keyCode] = true;
onkeyup = e => DOWN[e.keyCode] = false;
