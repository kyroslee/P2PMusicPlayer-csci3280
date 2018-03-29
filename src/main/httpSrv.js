const express = require('express');
const cors = require('cors');
const range = require('express-range');
const http = require('http');
const mdns = require('mdns');

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
        //app.use('/media', express.static(mediaPath));

        const server = http.createServer(app).listen();
        app.set('port', server.address().port);
        mdns.createAdvertisement(
            mdns.tcp('yo'),
            server.address().port
        ).start();
    }
}
