const wav_parser = require('../build/Release/wav_parser');

class WavPlayer {
  constructor({ audioCtx }) {
    this.ctx = audioCtx;
    this.src = null;
    this.duration = null;
    this.buf = null;
    this.dest = null;
    this.currentTime = 0;
    this.state = "stop";
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
      if(this.state === "stop")
        this.ctx.resume();
      this.state = "running";
      this.currentTime = 0;
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
      this.currentTime = 0;
      this.src.stop();
      this.src.disconnect();
      this.src = null;
    }
  }

  pause(){
      if(this.ctx.state === 'running') {
        this.state = "stop";
        this.ctx.suspend();
    } else if(this.ctx.state === 'suspended') {
        this.state = "running";
        this.ctx.resume();
    }
  }

  seek(time){
    if(this.buf){
      if(this.src){
        this.ctx.suspend();
        this.stop();
      }
      const offset = this.duration * (time / this.duration);
      this.currentTime = this.duration * (time / this.duration);
      this.src = this.ctx.createBufferSource();
      this.src.buffer = this.buf;
      this.src.connect(this.dest);
      this.src.start(0, offset);
      this.ctx.resume();
    }
  }

  update(){
      if(this.state === 'running' && this.currentTime < this.duration) {
        this.currentTime += 1;
      }
  }

  get_current_time(){
    return this.currentTime;
  }

  get_duration(){
    return Math.floor(this.duration);
  }

  getTimeString(time){
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time) - minutes * 60;
    return (this.str_pad_left(minutes,'0',2) + ":" + this.str_pad_left(seconds,"0", 2));
  }

  str_pad_left(string, pad, length){
    return (new Array(length+1).join(pad)+string).slice(-length);
  }

  check_state(){
    return this.src;
  }
}

module.exports = WavPlayer;
