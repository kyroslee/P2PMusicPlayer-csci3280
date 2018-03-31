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
