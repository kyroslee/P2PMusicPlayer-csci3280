
class Visualizer{

  constructor({audioCtx, canvas}){
    //bind html canvas into visualizer and set up
    this.visualizer = document.getElementById('visualizer');
    this.analyser = audioCtx.createAnalyser();
    this.visualizer.height = 40;
    this.visualizer.width = 200;
    this.context = this.visualizer.getContext('2d');

    this.analyser.fftSize = 512;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.draw();
  }

  draw(){
        this.analyser.getByteFrequencyData(this.dataArray);

    this.context.fillStyle = 'rgb(0, 0, 0)';
    this.context.fillRect(0, 0, this.visualizer.width, this.visualizer.height);

    var barWidth = (this.visualizer.width / this.analyser.fftSize) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < this.analyser.fftSize; i++) {
      barHeight = this.dataArray[i];

      this.context.fillStyle = 'rgb(' + (barHeight+100) + ', 30,  30)';
      this.context.fillRect(x,this.visualizer.height-barHeight,barWidth,barHeight);

      x += barWidth + 1;
    }
    // this.analyser.getByteTimeDomainData(this.dataArray);
    //
    // this.context.fillStyle = 'rgb(200, 200, 200)';
    // this.context.fillRect(0, 0, this.visualizer.width, this.visualizer.height);
    //
    // this.context.lineWidth = 2;
    // this.context.strokeStyle = 'red';
    //
    // this.context.beginPath();
    //
    // var sliceWidth = this.visualizer.width * 3.0 / this.analyser.frequencyBinCount;
    // var x = 0;
    // console.log(this.dataArray);
    // for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
    //
    //   var v = this.dataArray[i] / 128.0;
    //   var y = v * this.visualizer.height / 2;
    //   if (i === 0) {
    //     this.context.moveTo(x, y);
    //   } else {
    //     this.context.lineTo(x, y);
    //   }
    //
    //   x += sliceWidth;
    // }
    //
    // this.context.lineTo(this.visualizer.width, this.visualizer.height / 2);
    // this.context.stroke();
        window.requestAnimationFrame(this.draw.bind(this));
  }
}

module.exports = Visualizer;
