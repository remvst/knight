const compiler = require('./js13k-compiler/src/compiler');

let belowLayer = -999999;
let aboveLayer = 999999;

const CONSTANTS = {
    "true": 1,
    "false": 0,
    "const": "let",
    "null": 0,

    "CANVAS_WIDTH": 1280,
    "CANVAS_HEIGHT": 720,

    "PLAYER_HEAVY_ATTACK_INDEX": 3,
    "PLAYER_HEAVY_CHARGE_TIME": 1,
    "PLAYER_PERFECT_PARRY_TIME": 0.1,
    "PLAYER_DASH_DURATION": 0.3,
    "PLAYER_DASH_DISTANCE": 200,

    "LAYER_CORPSE": belowLayer--,
    "LAYER_WATER": belowLayer--,
    "LAYER_PATH": belowLayer--,

    "LAYER_CHARACTER_HUD": aboveLayer++,
    "LAYER_PARTICLE": aboveLayer++,
    "LAYER_ANIMATIONS": aboveLayer++,
    "LAYER_WEATHER": aboveLayer++,
    "LAYER_PLAYER_HUD": aboveLayer++,
    "LAYER_FADE": aboveLayer++,
    "LAYER_INSTRUCTIONS": aboveLayer++,
    "LAYER_LOGO": aboveLayer++,
};

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

                "src/js/ai/character-controller.js",

                "src/js/entities/entity.js",
                "src/js/entities/camera.js",
                "src/js/entities/interpolator.js",
                "src/js/entities/cursor.js",
                "src/js/entities/path.js",

                "src/js/entities/animations/shield-block.js",
                "src/js/entities/animations/perfect-parry.js",
                "src/js/entities/animations/particle.js",
                "src/js/entities/animations/swing-effect.js",
                "src/js/entities/animations/rain.js",
                
                "src/js/entities/props/grass.js",
                "src/js/entities/props/obstacle.js",
                "src/js/entities/props/tree.js",
                "src/js/entities/props/bush.js",
                "src/js/entities/props/water.js",

                "src/js/entities/ui/label.js",
                "src/js/entities/ui/fade.js",
                "src/js/entities/ui/logo.js",
                "src/js/entities/ui/instruction.js",
                "src/js/entities/ui/exposition.js",
                "src/js/entities/ui/pause-overlay.js",

                "src/js/entities/characters/character-hud.js",
                "src/js/entities/characters/player-hud.js",

                "src/js/entities/characters/character.js",
                "src/js/entities/characters/player.js",

                "src/js/entities/characters/stick-enemy.js",
                "src/js/entities/characters/stick-and-shirt-enemy.js",
                "src/js/entities/characters/sword-and-shield-enemy.js",
                "src/js/entities/characters/sword-enemy.js",
                "src/js/entities/characters/sword-and-armor-enemy.js",
                "src/js/entities/characters/tank-enemy.js",
                "src/js/entities/characters/dummy-enemy.js",

                "src/js/entities/characters/corpse.js",

                "src/js/sound/ZzFXMicro.js",

                "src/js/level/level.js",
                "src/js/level/intro-level.js",
                "src/js/level/gameplay-level.js",
                
                "src/js/util/resizer.js",
                "src/js/util/first-item.js",
                "src/js/util/rng.js",
                "src/js/util/regen-entity.js",
            
                "src/js/scene.js",
                "src/js/index.js",
            ]),
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
                    "async"
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
                ]
            }));
        }

        if (uglify) {
            sequence.push(tasks.uglifyES());
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
            tasks.output(__dirname + '/build/game.zip'),
            tasks.checkSize(__dirname + '/build/game.zip'),
            tasks.advzip(__dirname + '/build/game.zip'),
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
