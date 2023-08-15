let MOUSE_DOWN = false;
const MOUSE_POSITION = {x: 0, y: 0};
onmousedown = () => MOUSE_DOWN = true;
onmouseup = () => MOUSE_DOWN = false;
onmousemove = (event) => getEventPosition(event, MOUSE_POSITION);

getEventPosition = (event, out) => {
    if (!can) return;
    const canvasRect = can.getBoundingClientRect();
    out.x = (event.pageX - canvasRect.left) / canvasRect.width * CANVAS_WIDTH;
    out.y = (event.pageY - canvasRect.top) / canvasRect.height * CANVAS_HEIGHT;
}
