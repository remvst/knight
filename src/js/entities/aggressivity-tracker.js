class AggressivityTracker extends Entity {
    constructor() {
        super();
        this.categories.push('aggressivity-tracker');
        this.currentAggression = 0;
        this.aggressive = new Set();
    }

    get z() { 
        return LAYER_PATH + 1;
    }

    requestAggression(enemy) {
        this.cancelAggression(enemy);

        const { aggression } = enemy;
        if (this.currentAggression + aggression > MAX_AGGRESSION) {
            return;
        }

        this.currentAggression += aggression;
        this.aggressive.add(enemy);
        return true
    }

    cancelAggression(enemy) {
        if (this.aggressive.has(enemy)) {
            const { aggression } = enemy;
            this.currentAggression -= aggression;
            this.aggressive.delete(enemy);
        }
    }

    doRender(camera) {
        if (DEBUG) {
            return;
            fillStyle = '#fff';
            strokeStyle = '#000';
            lineWidth = 5;
            textAlign = nomangle('center');
            textBaseline = nomangle('middle');
            font = nomangle('12pt Courier');

            wrap(() => {
                translate(camera.x, camera.y - 100);
        
                strokeText('Agg: ' + this.currentAggression, 0, 0);
                fillText('Agg: ' + this.currentAggression, 0, 0);
            });

            const player = firstItem(this.scene.category('player'));
            if (!player) return;

            for (const enemy of this.aggressive) {
                strokeStyle = '#f00';
                lineWidth = 20;
                globalAlpha = 0.1;
                beginPath();
                moveTo(enemy.x, enemy.y);
                lineTo(player.x, player.y);
                stroke();
            }
        }
    }
}
