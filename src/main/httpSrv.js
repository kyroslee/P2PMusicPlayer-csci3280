const express = require('express');
const cors = require('cors');
const range = require('express-range');
const http = require('http');
const mdns = require('mdns');
const db = require('./db.js');

module.exports = {
    start(mediaPath){
        const app = express();

        app.use(cors({
            exposedHeaders: [
                'Content-Length',
                'Wav-Samples',
                'Wav-SampleRate'
            ]
        }));

        app.use(range({ accept: 'samples' }));
        app.use('/media', express.static(mediaPath));

        const localAlbums = db.getLocalAlbums(mediaPath);
        app.get('/db', (req, res)=>{
            res.json(localAlbums);
            res.end();
        });

        const server = http.createServer(app).listen();
        app.set('port', server.address().port);
        mdns.createAdvertisement(
            mdns.tcp('p2p-player'),
            server.address().port
        ).start();
    }
}
