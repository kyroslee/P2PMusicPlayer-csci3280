const wav_parser = require('./build/Release/wav_parser');

class WavPlayer {
  constructor({ audioCtx }) {
    this.ctx = audioCtx;
    this.src = null;
    this.duration = null;
    this.buf = null;
    this.dest = null;
    this.startTime = 0;
    this.pauseTime = 0;
  }

  connect(dest) {
    this.dest = dest;
  }

  play(fileName) {
    if(this.src){
      this.src.stop();
      this.src.disconnect();
      this.src = null;
    }
    wav_parser.wav_parsing(fileName,(samples, sampleRate, leftBuf, rightBuf) => {
      this.duration = samples / sampleRate;
      this.buf = this.ctx.createBuffer(2, samples, sampleRate);
      this.buf.copyToChannel(new Float32Array(leftBuf), 0);
      this.buf.copyToChannel(new Float32Array(rightBuf), 1);
      this.src = this.ctx.createBufferSource();
      this.src.buffer = this.buf;
      this.src.connect(this.dest)
      this.src.start();
    });
  }

  stop() {
    if(this.src) {
      this.src.stop();
      this.src.disconnect();
      this.src = null;
    }
  }
}

module.exports = WavPlayer;
