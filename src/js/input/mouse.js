let MOUSE_DOWN = false;
let MOUSE_RIGHT_DOWN = false;
const MOUSE_POSITION = {x: 0, y: 0};
onmousedown = (evt) => evt.button == 2 ? MOUSE_RIGHT_DOWN = true : MOUSE_DOWN = true;
onmouseup = (evt) => evt.button == 2 ? MOUSE_RIGHT_DOWN = false : MOUSE_DOWN = false;
onmousemove = (evt) => getEventPosition(evt, MOUSE_POSITION);

oncontextmenu = (evt) => evt.preventDefault();

getEventPosition = (event, out) => {
    if (!can) return;
    const canvasRect = can.getBoundingClientRect();
    out.x = (event.pageX - canvasRect.left) / canvasRect.width * CANVAS_WIDTH;
    out.y = (event.pageY - canvasRect.top) / canvasRect.height * CANVAS_HEIGHT;
}
