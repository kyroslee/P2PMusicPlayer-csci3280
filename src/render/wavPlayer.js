class WavPlayer {
    constructor({ audioCtx }) {
        this.ctx = audioCtx;
        this.src = null;
        this.samples = null;
        this.sampleRate = null;
        this.buf = null;
        this.dest = null;
        this.duration = null;
        this.startTime = null;
        this.pauseTime = null;
        this.onPlayStateChange = null;
        this.onProgressUpdate = null;
        this._updateProgress();
    }
    _updateProgress() {
        if(this.src && this.onProgressUpdate) {
            const p = (this.ctx.currentTime - this.startTime) / this.duration;
            this.onProgressUpdate(p, this.getCurrentTime());
        }
        window.requestAnimationFrame(this._updateProgress.bind(this));
    }
    connect(dest) {
        this.dest = dest;
    }
    disconnect() {
        this.pause();
    }
    isPlaying() {
        return this.src != null;
    }
    getCurrentTime() {
        return (this.ctx.currentTime - this.startTime);
    }
    _start(offset = 0) {
        this.src = this.ctx.createBufferSource();
        this.src.buffer = this.buf;
        this.src.connect(this.dest);
        this.src.start(0, offset);
        this.startTime = this.ctx.currentTime - offset;
        if(this.onPlayStateChange) {
            this.onPlayStateChange(true);
        }
    }
    pause() {
        if(this.src) {
            this.pauseTime = this.ctx.currentTime;
            this.src.stop();
            this.src.disconnect();
            this.src = null;
        }
        if(this.onPlayStateChange) {
            this.onPlayStateChange(false);
        }
    }
    seek(p) {
        if(this.buf && 0 <= p && p <= 1) {
            if(this.src) this.pause();
            this._start(this.duration * p);
        }
    }
    async play(urlList) {
        if(urlList) {
            if(this.src) this.pause();
            const { headers } = await fetch(urlList[0], {method: 'head'});
            this.samples = headers.get('Wav-Samples');
            this.sampleRate = headers.get('Wav-SampleRate');
            console.log(urlList);
            //console.log(this.samples);console.log(this.sampleRate);
            this.duration = this.samples / this.sampleRate;
            this.buf = this.ctx.createBuffer(2, this.samples, this.sampleRate);
            const leftBuf = this.buf.getChannelData(0);
            const rightBuf = this.buf.getChannelData(1);
            const chunks = 8;
            const chunkSize = Math.floor(this.samples / chunks);
            for(let i = 0; i < chunks; i++) {
                const src = urlList[i % urlList.length];
                const off = i*chunkSize;
                const len = (i < chunks-1)? chunkSize: this.samples - chunkSize*i;
                const resp = await fetch(src, {headers: {
                    Range: `samples=${off}-${off+len-1}`
                }});
                const buf = new Float32Array(await resp.arrayBuffer());
                for(let s = off; s < off+len; s++) {
                    leftBuf[s] = buf[(s-off)*2];
                    rightBuf[s] = buf[(s-off)*2+1];
                }
                if(i === 0) this._start();
            }
        } else if(this.buf) {
            this._start(this.pauseTime - this.startTime);
        }
    }
}

module.exports = WavPlayer;
