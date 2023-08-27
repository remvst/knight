const w = window;

let can;
let ctx;

let GAME_PAUSED;
let BEATEN;

canvasPrototype = CanvasRenderingContext2D.prototype;

inputMode = navigator.userAgent.match(nomangle(/andro|ipho|ipa|ipo/i)) ? INPUT_MODE_TOUCH : INPUT_MODE_MOUSE;
