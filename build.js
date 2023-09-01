const compiler = require('./js13k-compiler/src/compiler');
const spawn = require('child_process').spawn;
const Task = require('./js13k-compiler/src/tasks/task');

class ECTZip extends Task {
    constructor(filename) {
        super();
        this.filename = filename;
    }

    execute(input) {
        return new Promise((resolve, reject) => {
            // Guess I'm hardcoding this :p
            const subprocess = spawn('./Efficient-Compression-Tool/build/ect', [
                '-zip', 
                this.filename,
                '-9',
                '-strip',
            ]);

            subprocess.on('exit', (code) => {
                if (code === 0) {
                    resolve(input);
                } else {
                    reject('ect failed with error code ' + code);
                }
            });
        });
    }
}

let belowLayer = -9990;
let aboveLayer = 9990;

const CONSTANTS = {
    "true": 1,
    "false": 0,
    "const": "let",
    "null": 0,

    "LARGE_INT": 9999,

    "CANVAS_WIDTH": 1280,
    "CANVAS_HEIGHT": 720,

    "WAVE_COUNT": 8,

    "PLAYER_HEAVY_ATTACK_INDEX": 3,
    "PLAYER_HEAVY_CHARGE_TIME": 1,
    "PLAYER_PERFECT_PARRY_TIME": 0.15,
    "PLAYER_DASH_DURATION": 0.3,
    "PLAYER_DASH_DISTANCE": 200,
    "PLAYER_MAGNET_RADIUS": 250,

    "STRIKE_WINDUP": 0.05,
    "STRIKE_DURATION": 0.15,

    "MAX_AGGRESSION": 6,

    "LAYER_CORPSE": belowLayer--,
    "LAYER_WATER": belowLayer--,
    "LAYER_PATH": belowLayer--,
    "LAYER_LOWER_FADE": belowLayer--,

    "LAYER_CHARACTER_HUD": aboveLayer++,
    "LAYER_PARTICLE": aboveLayer++,
    "LAYER_ANIMATIONS": aboveLayer++,
    "LAYER_WEATHER": aboveLayer++,
    "LAYER_PLAYER_HUD": aboveLayer++,
    "LAYER_LOGO": aboveLayer++,
    "LAYER_FADE": aboveLayer++,
    "LAYER_INSTRUCTIONS": aboveLayer++,

    "CHEST_WIDTH_ARMORED": 25,
    "CHEST_WIDTH_NAKED": 22,

    "COLOR_SKIN": "'#fec'",
    "COLOR_SHIRT": "'#753'",
    "COLOR_LEGS": "'#666'",
    "COLOR_ARMORED_ARM": "'#666'",
    "COLOR_ARMOR": "'#ccc'",
    "COLOR_WOOD": "'#634'",

    "DEBUG_AGGRESSIVITY": false,
    "DEBUG_CHARACTER_RADII": false,
    "DEBUG_CHARACTER_STATE": false,
    "DEBUG_CHARACTER_STATS": false,
    "DEBUG_CHARACTER_AI": false,
    "DEBUG_PLAYER_MAGNET": false,

    "RENDER_PLAYER_ICON": false,
    "RENDER_SCREENSHOT": false,

    "INPUT_MODE_MOUSE": 0,
    "INPUT_MODE_TOUCH": 1,
    "INPUT_MODE_GAMEPAD": 2,

    "TOUCH_JOYSTICK_RADIUS": 50,
    "TOUCH_JOYSTICK_MAX_RADIUS": 150,
    "TOUCH_BUTTON_RADIUS": 35,

    "RIPPLE_DURATION": 2,
    "THUNDER_INTERVAL": 10,

    "SONG_VOLUME": 0.5,

    // Fix for my mangler sucking
    "aggressivity-tracker": 'at',
};

if (CONSTANTS.RENDER_SCREENSHOT) {
    CONSTANTS.CANVAS_HEIGHT = CONSTANTS.CANVAS_WIDTH / (400 / 250);
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

compiler.run((tasks) => {
    function buildJS({
        mangle,
        uglify
    }) {
        // Manually injecting the DEBUG constant
        const constants = copy(CONSTANTS);
        constants.DEBUG = !uglify;

        const sequence = [
            tasks.label('Building JS'),
            tasks.loadFiles([
                "src/js/globals.js",
                "src/js/math.js",
                "src/js/state-machine.js",

                "src/js/graphics/create-canvas.js",
                "src/js/graphics/wrap.js",
                "src/js/graphics/with-shadow.js",
                "src/js/graphics/characters/exclamation.js",
                "src/js/graphics/characters/body.js",
                "src/js/graphics/gauge.js",
                "src/js/graphics/text.js",

                "src/js/input/keyboard.js",
                "src/js/input/mouse.js",
                "src/js/input/touch.js",

                "src/js/ai/character-controller.js",

                "src/js/entities/entity.js",
                "src/js/entities/camera.js",
                "src/js/entities/interpolator.js",
                "src/js/entities/cursor.js",
                "src/js/entities/path.js",
                "src/js/entities/aggressivity-tracker.js",

                "src/js/entities/animations/full-charge.js",
                "src/js/entities/animations/shield-block.js",
                "src/js/entities/animations/perfect-parry.js",
                "src/js/entities/animations/particle.js",
                "src/js/entities/animations/swing-effect.js",
                "src/js/entities/animations/rain.js",
                "src/js/entities/animations/bird.js",
                
                "src/js/entities/props/grass.js",
                "src/js/entities/props/obstacle.js",
                "src/js/entities/props/tree.js",
                "src/js/entities/props/bush.js",
                "src/js/entities/props/water.js",

                "src/js/entities/ui/label.js",
                "src/js/entities/ui/fade.js",
                "src/js/entities/ui/logo.js",
                "src/js/entities/ui/announcement.js",
                "src/js/entities/ui/instruction.js",
                "src/js/entities/ui/exposition.js",
                "src/js/entities/ui/pause-overlay.js",

                "src/js/entities/characters/character-hud.js",
                "src/js/entities/characters/player-hud.js",

                "src/js/entities/characters/character.js",
                "src/js/entities/characters/player.js",
                "src/js/entities/characters/enemy.js",
                "src/js/entities/characters/dummy-enemy.js",
                "src/js/entities/characters/king-enemy.js",
                "src/js/entities/characters/character-offscreen-indicator.js",

                "src/js/entities/characters/corpse.js",

                "src/js/sound/ZzFXMicro.js",
                "src/js/sound/sonantx.js",
                "src/js/sound/song.js",

                "src/js/level/level.js",
                "src/js/level/intro-level.js",
                "src/js/level/gameplay-level.js",
                constants.DEBUG ? "src/js/level/test-level.js" : null,
                constants.DEBUG ? "src/js/level/screenshot-level.js" : null,
                
                "src/js/util/resizer.js",
                "src/js/util/first-item.js",
                "src/js/util/rng.js",
                "src/js/util/regen-entity.js",
            
                "src/js/scene.js",
                "src/js/index.js",
            ].filter(file => !!file)),
            tasks.concat(),
            tasks.constants(constants),
            tasks.macro('evaluate'),
            tasks.macro('nomangle'),
        ];

        if (mangle) {
            sequence.push(tasks.mangle({
                "skip": [
                    "arguments",
                    "callee",
                    "flat",
                    "left",
                    "px",
                    "pt",
                    "movementX",
                    "movementY",
                    "imageSmoothingEnabled",
                    "cursor",
                    "flatMap",
                    "monetization",
                    "yield",
                    "await",
                    "async",
                    "try",
                    "catch",
                    "finally",
                ],
                "force": [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z",
                    "alpha",
                    "background",
                    "direction",
                    "ended",
                    "key",
                    "left",
                    "level",
                    "maxDistance",
                    "remove",
                    "right",
                    "speed",
                    "start",
                    "item",
                    "center",
                    "wrap",
                    "angle",
                    "target",
                    "path",
                    "step",
                    "color",
                    "expand",
                    "label",
                    "action",
                    "normalize",
                    "duration",
                    "message",
                    "name",
                    "ratio",
                    "size",
                    "index",
                    "controls",
                    "attack",
                    "end",
                    "description",
                    "resolve",
                    "reject",
                    "category",
                    "update",
                    "error",
                    "endTime",
                    "aggressivity",
                    "radiusX",
                    "radiusY",
                    "state",
                    "rotation",
                    "contains",
                    "zoom",
                    "object",
                    "entity",
                    "Entity",
                    "entities",
                    "timeout",
                    "frame",
                    "line",
                    "repeat",
                    "elements",
                    "text",
                    "source",
                    "frequency",
                ]
            }));
        }

        if (uglify) {
            sequence.push(tasks.uglifyES());
            sequence.push(tasks.roadroller());
        }

        return tasks.sequence(sequence);
    }

    function buildCSS(uglify) {
        const sequence = [
            tasks.label('Building CSS'),
            tasks.loadFiles([__dirname + "/src/css/style.css"]),
            tasks.concat()
        ];

        if (uglify) {
            sequence.push(tasks.uglifyCSS());
        }

        return tasks.sequence(sequence);
    }

    function buildHTML(uglify) {
        const sequence = [
            tasks.label('Building HTML'),
            tasks.loadFiles([__dirname + "/src/index.html"]),
            tasks.concat()
        ];

        if (uglify) {
            sequence.push(tasks.uglifyHTML());
        }

        return tasks.sequence(sequence);
    }

    function buildMain() {
        return tasks.sequence([
            tasks.block('Building main files'),
            tasks.parallel({
                'js': buildJS({
                    'mangle': true,
                    'uglify': true
                }),
                'css': buildCSS(true),
                'html': buildHTML(true)
            }),
            tasks.combine(),
            tasks.output(__dirname + '/build/index.html'),
            tasks.label('Building ZIP'),
            tasks.zip('index.html'),

            // Regular zip
            tasks.output(__dirname + '/build/game.zip'),
            tasks.checkSize(__dirname + '/build/game.zip'),

            // ADV zip
            tasks.advzip(__dirname + '/build/game.zip'),
            tasks.checkSize(__dirname + '/build/game.zip'),

            // ECT zip
            new ECTZip(__dirname + '/build/game.zip'),
            tasks.checkSize(__dirname + '/build/game.zip'),
        ]);
    }

    function buildDebug({
        mangle,
        suffix
    }) {
        return tasks.sequence([
            tasks.block('Building debug files'),
            tasks.parallel({
                // Debug JS in a separate file
                'debug_js': tasks.sequence([
                    buildJS({
                        'mangle': mangle,
                        'uglify': false
                    }),
                    tasks.output(__dirname + '/build/debug' + suffix + '.js')
                ]),

                // Injecting the debug file
                'js': tasks.inject(['debug' + suffix + '.js']),

                'css': buildCSS(false),
                'html': buildHTML(false)
            }),
            tasks.combine(),
            tasks.output(__dirname + '/build/debug' + suffix + '.html')
        ]);
    }

    function main() {
        return tasks.sequence([
            buildMain(),
            buildDebug({
                'mangle': false,
                'suffix': ''
            }),
            buildDebug({
                'mangle': true,
                'suffix': '_mangled'
            })
        ]);
    }

    return main();
});
