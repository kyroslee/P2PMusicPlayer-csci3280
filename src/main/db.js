const fs   = require('fs');
const yaml = require('js-yaml');

function getLocalAlbums(mediaPath){
    return fs.readdirSync(mediaPath)
        .filter(file => {
            return fs.statSync(`${mediaPath}/${file}`).isDirectory();
        })
        .map(albumName => {
            const albumYmlPath = `${mediaPath}/${albumName}/album.yml`;
            const albumYml = fs.readFileSync(albumYmlPath, 'utf8');

            const { tracks, artist: albumArtist } = yaml.safeLoad(albumYml);
            return {
                album: albumName,
                artwork: `media/${albumName}/cover.jpg`,
                tracks: tracks.map(track => {        
                    const lrcParts = `${mediaPath}/${albumName}/${track.file}`.split('.');
                    lrcParts.pop();
                    lrcParts.push('lrc');
                    const lrcFile = lrcParts.join('.');
                    return {
                        track: track.track,
                        title: track.title,
                        artist: track.artist || albumArtist,
                        file: `media/${albumName}/${track.file}`,
                        fileType: track.file.split('.').pop().toUpperCase(),
                        lyrics: (fs.existsSync(lrcFile)) ?
                        fs.readFileSync(lrcFile,'utf-8'):null
                    }
                })
            };
        });
}

module.exports = {getLocalAlbums}
