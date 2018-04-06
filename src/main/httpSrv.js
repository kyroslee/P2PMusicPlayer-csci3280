const express = require('express');
const cors = require('cors');
const range = require('express-range');
const http = require('http');
const mdns = require('mdns');
const db = require('./db.js');
const wavDecoder = require('../../build/Release/decoder');

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

        const localAlbums = db.getLocalAlbums(mediaPath);
        app.get('/db', (req, res)=>{
            res.json(localAlbums);
            res.end();
        });

        app.head('/media/:filePath(*.wav)', (req, res) => {
            wavDecoder.decode(
                `${mediaPath}/${req.params.filePath}`, false,
                (samples, sampleRate) => {
                    res.set('Wav-Samples', samples);
                    res.set('Wav-SampleRate', sampleRate);
                    res.end();
                }
            );
        });
        
        app.get('/media/:filePath(*.wav)', ({
            params: { filePath }, range
        }, res) => {
            wavDecoder.decode(
                `${mediaPath}/${filePath}`, true,
                (samples, sampleRate, buf) => {
                    res.set('Wav-Samples', samples);
                    res.set('Wav-SampleRate', sampleRate);
                    console.log(samples);console.log(sampleRate);
                    const sampleSize = 4*2; // float * stereo
                    if(range) {
                        res.range({
                            first: range.first,
                            last: range.last,
                            length: buf.byteLength/sampleSize
                        });
                        res.end(Buffer.from(
                            buf,
                            range.first*sampleSize,
                            (range.last-range.first+1)*sampleSize
                        ));
                    } else {
                        res.end(Buffer.from(buf));
                    }
                }
            );
        });

        app.use('/media', express.static(mediaPath));
        
        const server = http.createServer(app).listen();
        app.set('port', server.address().port);
        mdns.createAdvertisement(
            mdns.tcp('p2p-player'),
            server.address().port
        ).start();
    }
}
