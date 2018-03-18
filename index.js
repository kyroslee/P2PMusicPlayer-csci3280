const WavPlayer = require('./wavPlayer.js');
const Visualizer = require('./visualizer.js');

const audioCtx = new AudioContext();

const wavPlayer = new WavPlayer({
  audioCtx
});

const visualizer = new Visualizer({
  audioCtx,
  canvas: '#visualizer'
});
visualizer.analyser.connect(audioCtx.destination);

const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');

ipcRenderer.on('item:add', function(e,item){
    const li = document.createElement('li');
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});

ul.addEventListener('dbclick', removeItem);

function removeItem(e){
    e.target.remove();
}

function playWav() {
    wavPlayer.connect(audioCtx.destination);
    wavPlayer.connect(visualizer.analyser);
    wavPlayer.play('abc.wav');
}

function pause(){
    if(audioCtx.state === 'running') {
    audioCtx.suspend();
  } else if(audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function stop(){
    wavPlayer.stop();
}
