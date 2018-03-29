const mdns = require('mdns');
const IPv6 = require('ip-address').Address6;

window.p2pPeers = {};
window.p2pAlbums = {};

const p2pBrowser = mdns.createBrowser(mdns.tcp('yo'));

let listUpdateHandler = () => {};
function setListUpdateHandler(f) {
      listUpdateHandler = f;
}

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

    console.log(peer);
});

p2pBrowser.on('serviceDown', ({name : peerName}) => {
    delete p2pPeers[peerName];
});

p2pBrowser.start();
