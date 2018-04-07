class Visualizer{

    constructor({audioCtx, canvas}){
        //bind html canvas into visualizer and set up
        this.visualizer = document.getElementById('visualizer');
        this.analyser = audioCtx.createAnalyser();
        this.visualizer.height = 300;
        this.visualizer.width = 1024;
        this.context = this.visualizer.getContext('2d');
        this.lyrics = null;
        this.currentLyric = null;

        this.analyser.fftSize = 512;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.draw();
    }

    setLyrics(lrcFile) {
        this.currentLyric = null;
        this.lyrics = lrcFile;
        if (this.lyrics){
            this.lyrics.lrcArray.forEach(({ timestamp }) => {
                timestamp = parseFloat(timestamp);
            });
        }
    }

    updateLyrics(currentTime) {
        if (this.lyrics){
            for (let i=0; i< this.lyrics.lrcArray.length; i++){
                const { timestamp } = this.lyrics.lrcArray[i];
                if (timestamp > currentTime && i>0){
                    const { lyric } = this.lyrics.lrcArray[i-1];
                    //console.log(lyric);
                    this.currentLyric = lyric;
                    break;
                }
            }
        }
    }

    draw(){
        this.analyser.getByteFrequencyData(this.dataArray);

        this.context.fillStyle = 'rgb(0, 0, 0)';
        this.context.fillRect(0, 0, this.visualizer.width, this.visualizer.height);

        //lyric
        this.context.font = "20px Arial";
        this.context.textAlign = "center";
        this.context.fillStyle = "#FFF";
        if (this.currentLyric)
            this.context.fillText(this.currentLyric,this.visualizer.width/2, 40);

        var barWidth = (this.visualizer.width / this.analyser.fftSize)*2;
        var barHeight;
        var x = 0;

        for(var i = 0; i < this.analyser.fftSize; i++) {
            barHeight = this.dataArray[i];

            this.context.fillStyle = 'rgb(' + (barHeight+100) + ', 30,  30)';
            this.context.fillRect(x,this.visualizer.height-barHeight,barWidth,barHeight);

            x += barWidth + 1;
        }
        window.requestAnimationFrame(this.draw.bind(this));
    }
}

module.exports = Visualizer;
