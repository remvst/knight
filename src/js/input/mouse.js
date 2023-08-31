MOUSE_DOWN = false;
MOUSE_RIGHT_DOWN = false;
MOUSE_POSITION = {x: 0, y: 0};

onmousedown = (evt) => evt.button == 2 ? MOUSE_RIGHT_DOWN = true : MOUSE_DOWN = true;
onmouseup = (evt) => evt.button == 2 ? MOUSE_RIGHT_DOWN = false : MOUSE_DOWN = false;
onmousemove = (evt) => getEventPosition(evt, can, MOUSE_POSITION);

oncontextmenu = (evt) => evt.preventDefault();

getEventPosition = (event, can, out) => {
    if (!can) return;
    const canvasRect = can.getBoundingClientRect();
    out.x = (event.pageX - canvasRect.left) / canvasRect.width * can.width;
    out.y = (event.pageY - canvasRect.top) / canvasRect.height * can.height;
}
