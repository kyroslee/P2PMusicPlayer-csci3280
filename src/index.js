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
    const songInfoDiv = document.querySelector('tbody.songInfo');
    const tr = document.createElement('tr');
    for(var i = 0; i <item.length; i++){
        //console.log(item[i]);
        var td = document.createElement('td');
        switch(i){
            case 0:
                td.className = 'songName';
                break;
            case 1:
                td.className = 'artist';
                break;
            case 2:
                td.className = 'album';
                break;
            case 3:
                td.className = 'lyrics';
                break;
            default:
                console.log("helloworld");
        }
        var itemContent = document.createTextNode(item[i]);
        td.appendChild(itemContent);
        tr.appendChild(td);
        songInfoDiv.appendChild(tr);
    };

});

const songg = document.querySelector(".songInfo");
songg.addEventListener('click',function(e){
    playWav(e.target.innerHTML);
});


ul.addEventListener('dbclick', removeItem);

function removeItem(e){
    e.target.remove();
}

function playWav(song) {
    wavPlayer.connect(audioCtx.destination);
    wavPlayer.connect(visualizer.analyser);
    wavPlayer.play(song);
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
