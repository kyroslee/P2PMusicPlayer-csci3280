const WavPlayer = require('./wavPlayer.js');
const Visualizer = require('./visualizer.js');
const db = require('./db.js');

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

displaySongInDB();


ipcRenderer.on('item:add', function(e,item){
    const songInfoDiv = document.querySelector('tbody.songInfo');
    const tr = document.createElement('tr');
    for(var i = 0; i <item.length; i++){
        //console.log(item[i]);
        var td = document.createElement('td');
        switch(i){
            case 0:
                td.id = 'songName';
                break;
            case 1:
                td.id = 'artist';
                break;
            case 2:
                td.id = 'album';
                break;
            case 3:
                td.id = 'lyrics';
                break;
            default:
                console.log("helloworld");
        }
        var itemContent = document.createTextNode(item[i]);
        td.appendChild(itemContent);
        tr.appendChild(td);
    };
    songInfoDiv.appendChild(tr);
    var songObj = {"songName":item[0], "artist":item[1], "album":item[2], "lyrics":item[3]};
    db.insert(songObj);
});

ipcRenderer.on('item:delete', function(e,item){
    db.deleteSong(item);
    var remove = document.querySelector("tbody.songInfo");
    while(remove.hasChildNodes())
    {
        console.log("you have child");
        remove.removeChild(remove.lastChild);
    }
    console.log('deletefinished html');
    displaySongInDB();
});

const songg = document.querySelector(".songInfo");
songg.addEventListener('click',function(e){
    if(e.target.id == 'songName')
        playWav(e.target.innerHTML);
    else if(e.target.classNAme = 'lyrics')
        ;//show the lyrics
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

function displaySongInDB(){
    const songsInDB = db.Display();
    for(var i = 0;i < songsInDB.length; i++){
        console.log(songsInDB[i]);
        const dbSongInfo = document.querySelector('tbody.songInfo');
        const tr = document.createElement('tr');

        var itemName = document.createTextNode(songsInDB[i]['Name']);
        var td = document.createElement('td');
        td.id = 'songName';
        td.appendChild(itemName);
        tr.appendChild(td);

        var itemArtist = document.createTextNode(songsInDB[i]['artist']);
        var td1= document.createElement('td');
        td1.id = 'artist';
        td1.appendChild(itemArtist);
        tr.appendChild(td1);

        var itemAlbum = document.createTextNode(songsInDB[i]['album']);
        var td2 = document.createElement('td');
        td2.id = 'album';
        td2.appendChild(itemAlbum);
        tr.appendChild(td2);

        var itemLyrics = document.createTextNode(songsInDB[i]['lyrics']);
        var td3 = document.createElement('td');
        td3.id = 'lyrics';
        td3.appendChild(itemLyrics);
        tr.appendChild(td3);
        dbSongInfo.appendChild(tr);

    };
}
