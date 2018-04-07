class AudioPlayer {
    constructor({ audioCtx }) {
        this.ctx = audioCtx;
        this.audio = new Audio();
        this.audio.autoplay = true;
        this.src = this.ctx.createMediaElementSource(this.audio);
        this.onPlayStateChange = null;
        this.onProgressUpdate = null;
        this.audio.addEventListener('timeupdate', e => {
            if(this.onProgressUpdate) {
                const p = this.audio.currentTime/this.audio.duration;
                this.onProgressUpdate(p, this.getCurrentTime());
            }
        });
    }
    connect(dest) {
        this.src.connect(dest);
    }
    disconnect() {
        this.src.disconnect();
    }
    isPlaying() {
        return !this.audio.paused;
    }
    getCurrentTime() {
        return this.audio.currentTime;
    }
    play(fileName) {
        if(fileName) {
            this.audio.src = fileName;
        } else {
            this.audio.play();
        }
        if(this.onPlayStateChange) {
            this.onPlayStateChange(true);
        }
    }
    pause() {
        this.audio.pause();
        if(this.onPlayStateChange) {
            this.onPlayStateChange(false);
        }
    }
    seek(p) {
        if(0 <= p && p <= 1) {
            this.audio.currentTime = this.audio.duration * p;
        }
    }
}

module.exports = AudioPlayer;
