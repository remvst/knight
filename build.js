const compiler = require('./js13k-compiler/src/compiler');

const MANGLE_SETTINGS = require('./config/mangle');

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

                "src/js/input/keyboard.js",
                "src/js/input/mouse.js",

                "src/js/ai/character-controller.js",

                "src/js/entities/entity.js",
                "src/js/entities/camera.js",
                "src/js/entities/grass.js",
                "src/js/entities/obstacle.js",
                "src/js/entities/tree.js",
                "src/js/entities/bush.js",
                "src/js/entities/water.js",
                "src/js/entities/shield-block.js",
                "src/js/entities/interpolator.js",
                "src/js/entities/perfect-parry.js",
                "src/js/entities/cursor.js",
                "src/js/entities/particle.js",
                "src/js/entities/swing-effect.js",
                "src/js/entities/label.js",

                "src/js/entities/characters/character-hud.js",
                "src/js/entities/characters/player-hud.js",

                "src/js/entities/characters/character.js",
                "src/js/entities/characters/player.js",
                "src/js/entities/characters/medium-enemy.js",
                "src/js/entities/characters/light-enemy.js",
                "src/js/entities/characters/corpse.js",
                
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
            sequence.push(tasks.mangle(MANGLE_SETTINGS));
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
