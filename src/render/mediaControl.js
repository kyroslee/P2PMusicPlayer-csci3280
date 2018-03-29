class mediaControl {
    constructor({ title, playPauseButton, seekClickable, seekProgress }) {
        this.playPauseButton = document.querySelector(playPauseButton);
        this.seekClickable = document.querySelector(seekClickable);
        this.seekProgress = document.querySelector(seekProgress);
        this.onPlayPause = null;
        this.onSeek = null;
        this.playPauseButton.addEventListener('click', e => {
            if(this.onPlayPause) {
                this.onPlayPause();
            }
        });
        document.addEventListener('keydown', e => {
            if(this.onPlayPause && e.key === ' ') {
                this.onPlayPause();
            }
        });
        this.seekClickable.addEventListener('click', e => {
            const progress = e.offsetX / this.seekClickable.clientWidth;
            if(this.onSeek && 0 <= progress && progress <= 1) {
                this.onSeek(progress);
            }
        });
    }

    setPlayState(playing) {
        if(playing) {
            this.playPauseButton.classList.remove('fa-play');
            this.playPauseButton.classList.add('fa-pause');
        } else {
            this.playPauseButton.classList.remove('fa-pause');
            this.playPauseButton.classList.add('fa-play');
        }
    }

    setProgress(progress) {
        if(0 <= progress && progress <= 1) {
            this.seekProgress.style.width = `${progress*100}%`;
        }
    }

    setTitle(text) {
        document.title = text;
    }
}
module.exports = MediaControl;
