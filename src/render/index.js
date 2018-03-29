const p2p = require('./p2p.js');
const AudioPlayer = require('./audioPlayer.js');

const audioCtx = new AudioContext();

const audioPlayer = new AudioPlayer({audioCtx});
