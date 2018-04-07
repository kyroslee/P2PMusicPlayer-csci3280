const mdns = require('mdns');
const IPv6 = require('ip-address').Address6;

window.p2pPeers = {};
window.p2pAlbums = {};

//search peers
const p2pBrowser = mdns.createBrowser(mdns.tcp('p2p-player'));

let listUpdateHandler = () => {};
function setListUpdateHandler(f) {
    listUpdateHandler = f;
}

//add peer
p2pBrowser.on('serviceUp', ({ addresses, port, name}) => {
    if (!p2pPeers.hasOwnProperty(name)){
        p2pPeers[name] = {
            addresses : addresses.filter(a => !(new IPv6(a).isValid())),
            port : port,
            name : name
        }
    }
    const host = p2pPeers[name].addresses[0];
    const peer = `${host}:${port}`;


    //get album list
    fetch(`http://${peer}/db`)
    .then(r => r.json())
    .then(albums => {
        albums.forEach(album => {
            if (p2pAlbums.hasOwnProperty(album.album)){
                p2pAlbums[album.album].peers[name] = peer;
            }else{
                p2pAlbums[album.album] = album;
                p2pAlbums[album.album].peers = {[name]: peer};
            }
        });
        listUpdateHandler(p2pAlbums);
    });

    console.log(peer);
});

//remove peer
p2pBrowser.on('serviceDown', ({name : peerName}) => {
    delete p2pPeers[peerName];
});

p2pBrowser.start();

module.exports = {onListUpdate: setListUpdateHandler};
