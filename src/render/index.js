const p2p = require('./p2p.js');
const AudioPlayer = require('./audioPlayer.js');
const WavPlayer = require('./wavPlayer.js');
const MediaControl = require('./mediaControl.js');
const VideoPlayer = require('./videoPlayer.js');

//audio context
const audioCtx = new AudioContext();

//players
const audioPlayer = new AudioPlayer({ audioCtx });
const wavPlayer = new WavPlayer({ audioCtx });
const videoPlayer = new VideoPlayer({ audioCtx, video: 'video' });

//media control bar
const mediaControl = new MediaControl({
    playPauseButton: '#play-pause-button',
    seekClickable: '#seek-clickable',
    seekProgress: '#seek-progress'
});

const videoSection = document.querySelector('#video-section');
function connectPlayer(player, isVideo){
    player.connect(audioCtx.destination);

    mediaControl.onPlayPause = _ => {
        if (player.isPlaying()){
            player.pause();
        }else{
            player.play();
        }
    };

    mediaControl.onSeek = percent => {
        player.seek(percent);
    };

    player.onPlayStateChange = playing => {
        console.log(`play state: ${playing?"playing":"paused"}`);
        mediaControl.setPlayState(playing);
        if (isVideo) {
            if(playing) videoSection.classList.add('video-section-show');
            else videoSection.classList.remove('video-section-show');
        }
    };

    player.onProgressUpdate = percent => {
        mediaControl.setProgress(percent);
    };


    return player;
}

let player = connectPlayer(wavPlayer);
function playTrack(album, track){
    mediaControl.setTitle(`${track.title} - ${track.artist || album.artist}`);
    player.pause();
    player.disconnect();
    const firstPeer = Object.values(album.peers)[0];
    const urlList = Object.values(album.peers)
        .map(peer => `http://${peer}/${track.file}`);

    switch (track.fileType) {
        case "WAV" :
            player = connectPlayer(wavPlayer);
            player.play(urlList);
            break;
        case "MP3" :
        case "FLAC" :
            player = connectPlayer(audioPlayer);
            player.play(urlList[0]);
            break;
        default: //video or bmp
            player = connectPlayer(videoPlayer, true);
            player.play(urlList, track.fileType);
            break;
    }
    console.log(player);
}

const list = document.querySelector('#list-body');
const template = document.querySelector('#list-row-template');
const templateAlbum =
    template.content.querySelector('.list-row-album');
const templateAlbumName =
    template.content.querySelector('.list-row-album-name');
const templateAlbumArtwork =
    template.content.querySelector('.list-row-album-artwork');
const templateTrack =
    template.content.querySelector('.list-row-track');
const templateTitle =
    template.content.querySelector('.list-row-title');
const templateArtist =
    template.content.querySelector('.list-row-artist');
const templateFileType =
    template.content.querySelector('.list-row-file-type');
const templateNodes =
    template.content.querySelector('.list-row-nodes');

function renderList (albums){
    list.innerHTML = "";
    //Render for each album
    Object.values(albums).forEach(album => {
        const firstPeer = Object.values(album.peers)[0];
        templateAlbumName.textContent = album.album;
        templateAlbumArtwork.src = `http://${firstPeer}/${album.artwork}`;
        templateArtist.textContent = album.artist;
        templateAlbum.rowSpan = album.tracks.length;
        let firstTrack = true;
        //for each track
        album.tracks.forEach(track => {
            if (firstTrack){
                templateAlbum.style.display = "table-cell";
                firstTrack = false;
            }else{
                templateAlbum.style.display = "none";
            }
            templateTrack.textContent = track.track;
            templateTitle.textContent = track.title;
            if(track.artist) {
                templateArtist.textContent = track.artist;
            }
            templateFileType.textContent = track.fileType;
            templateNodes.textContent = Object.values(album.peers).join(' ');
            const row = document.importNode(template.content, true);
            row.querySelector('.list-row').addEventListener('click', e => playTrack(album, track));
            list.appendChild(row);
        });
    });
}

//searching function
const searchInput = document.querySelector('#search-input');

function strMatching(s1, s2){
    return (s1.toUpperCase().indexOf(s2.toUpperCase()) > -1);
}

p2p.onListUpdate(albums => {
    renderList(albums);
    searchInput.onkeyup = ({ target: {value: searchValue} })=>{
        const filteredAlbums = Object.values(albums)
            .map(album => {
                const albumCloned = JSON.parse(JSON.stringify(album));
                albumCloned.tracks = album.tracks.filter(({ title, artist: trackArtist }) => {
                    const artist = trackArtist || album.artist;
                    return strMatching(artist,searchValue) || strMatching(title,searchValue) || strMatching(album.album,searchValue);
                });
                return albumCloned;
            })
            .filter(({ tracks }) => tracks.length > 0);
        renderList(filteredAlbums);
    };
});
