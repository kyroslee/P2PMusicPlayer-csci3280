class VideoPlayer {
    constructor({ audioCtx, video }) {
        this.ctx = audioCtx;
        this.video = document.querySelector(video);
        this.video.autoplay = true;
        this.fileType = null;
        this.src = this.ctx.createMediaElementSource(this.video);
        this.onPlayStateChange = null;
        this.onProgressUpdate = null;
        this.video.addEventListener('timeupdate', e => {
            if(this.onProgressUpdate) {
                const p = this.video.currentTime/this.video.duration;
                this.onProgressUpdate(p);
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
        return (this.fileType !== "BMP")? !this.video.paused: true;
    }

    async play(urlList, fileType) {
        this.fileType = fileType;
        console.log(`video filetype is ${this.fileType}`);
        //handling interleaving bmp image
        if(this.fileType === "BMP") {
            const { headers } = await fetch(urlList[0], {method: 'head'});
            const length = headers.get('Content-Length');
            const chunks = 8;
            const chunkSize = Math.floor(length/chunks);
            let parts = [];
            for(let i = 0; i < chunks; i++) {
                const src = urlList[i % urlList.length];
                const off = i*chunkSize;
                const len = (i < chunks-1)? chunkSize: length - chunkSize*i;
                console.log({ off, len });
                const resp = await fetch(src, {headers: {
                    Range: `bytes=${off}-${off+len-1}`
                }});
                parts.push(await resp.arrayBuffer());
            }
            this.video.poster = URL.createObjectURL(new Blob(parts));
            this.video.src = '';
        } else {
            if(urlList) this.video.src = urlList[0];
            else this.video.play();
        }
        if(this.onPlayStateChange) {
            this.onPlayStateChange(true);
        }
    }
    pause() {
        if(this.fileType !== "BMP") this.video.pause();
        if(this.onPlayStateChange) {
            this.onPlayStateChange(false);
        }
    }
    seek(p) {
        if(0 <= p && p <= 1) {
            this.video.currentTime = this.video.duration * p;
        }
    }
}

module.exports = VideoPlayer;
