class RainSound {
    constructor() {
        this.audioContext = new AudioContext();
    }

    play() {
        this.stop();

        this.audioSource = this.audioContext.createBufferSource();
        this.gainNode = this.audioContext.createGain();
        this.audioSource.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = bufferSize; --i > 0; ) {
            output[i] = random() * 0.2 - 1;
        }

        this.audioSource.buffer = noiseBuffer;
        this.audioSource.loop = true;
        this.audioSource.start();

        this.volume = 0.5;

        if (this.fadeIn) {
            this.fadeIn = (this.fadeIn >= 0) ? this.fadeIn : 0.5;
        } else {
            this.fadeIn = 0.5;
        }

        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(this.volume / 4, this.audioContext.currentTime + this.fadeIn / 2);
        this.gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + this.fadeIn);
    }

    stop() {
        if (this.audioSource) {
            clearTimeout(this.fadeOutTimer);
            this.audioSource.stop();
        }
    }

    fadeOut() {
        if (this.fading) {
            this.stop();
        } else {
            this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
            this.fading = true;
            this.fadeOutTimer = setTimeout(() => this.stop(), 1300);
        }
    }
}
