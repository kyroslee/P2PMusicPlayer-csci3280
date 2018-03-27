const WavPlayer = require('./wavPlayer.js');
const Visualizer = require('./visualizer.js');
const db = require('./db.js');


var fs = require('fs');
var parseLrc = require('parse.lrc');




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

var lrcData;
var lrc;

const songg = document.querySelector(".songInfo");
songg.addEventListener('click',function(e){
    if(e.target.id == 'songName')
        playWav("./store/"+e.target.innerHTML);
    else if(e.target.classNAme = 'lyrics')
    {
        lrcData = fs.readFileSync("./store/"+ e.target.innerHTML,'utf-8');
        lrc = parseLrc(lrcData);
        console.log(lrc.lrcArray[0]);   //output: {lrcInfo:{...},lrcArray{....}}
    }//show the lyrics
});

function removeItem(e){
    e.target.remove();
}

function playWav(song) {
    wavPlayer.connect(audioCtx.destination);
    wavPlayer.connect(visualizer.analyser);
    wavPlayer.play(song);
}

function pause(){
    wavPlayer.pause();
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


var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = "00:00/00:00"; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.onchange = function() {
    wavPlayer.seek(this.value);
    // document.getElementById("demo").innerHTML = wavPlayer.getTimeString(wavPlayer.get_time()) + "/" + wavPlayer.get_duration();
    // output.innerHTML = this.value;
}

setInterval(timer, 1000);
function timer(){
  if(wavPlayer.check_state()){
    wavPlayer.update();
  }
    var current_time = wavPlayer.get_current_time();
    if(lrc)
    {
        for(var i = 0; i < lrc.lrcArray.length; i++){
            if(lrc.lrcArray[i].timestamp > current_time){
                document.getElementById("lyricsDisplay").innerHTML = lrc.lrcArray[i - 1].lyric;
                break;
            }
        }
    }
    slider.max = wavPlayer.get_duration();
    document.getElementById("myRange").value = current_time / wavPlayer.get_duration() * slider.max;
    document.getElementById("demo").innerHTML = wavPlayer.getTimeString(current_time) + "/" + wavPlayer.getTimeString(wavPlayer.get_duration());
}
