const p2p = require('./p2p.js');
const AudioPlayer = require('./audioPlayer.js');
const MediaControl = require('./MediaControl.js');

const audioCtx = new AudioContext();

const audioPlayer = new AudioPlayer({ audioCtx });

const mediaControl = new MediaControl({
    playPauseButton: '#play-pause-button',
    seekClickable: '#seek-clickable',
    seekProgress: '#seek-progress'
})

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

p2p.onListUpdate(albums => {
    list.innerHTML = "";
    //for each album
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
            row.querySelector('.list-row')
                .addEventListener('click', e => playTrack(album, track));
            list.appendChild(row);
        });
    });
});
