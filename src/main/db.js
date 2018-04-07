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
                tracks: tracks.map(track => ({
                    track: track.track,
                    title: track.title,
                    artist: track.artist || albumArtist,
                    file: `media/${albumName}/${track.file}`,
                    fileType: track.file.split('.').pop().toUpperCase()
                }))
            };
        });
}

module.exports = {getLocalAlbums}
