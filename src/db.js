var sqlite3 = require('better-sqlite3');
var db = new sqlite3('song.sqlite');
var song = new Array();

  function create()
  {
      db.exec("CREATE TABLE if not exists song(" +
              "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
              "Name String, " +
              "artist String, " +
              "album String, " +
              "lyrics String)");
  }

  function insert(song)
  {
        var stmt = db.prepare("INSERT INTO song (Name, artist, album, lyrics)" +
                              "select ?1, ?2, ?3, ?4" +
                              "where not exists(select * from song where Name = ?5)");
        stmt.run({
          1: song.songName,
          2: song.artist,
          3: song.album,
          4: song.lyrics,
          5: song.songName
        });
  }

  function deleteSong(song)
  {
        var stmt = db.prepare("DELETE FROM song WHERE " +
                              "Name ='" + song[0] + "'");
        //console.log("deleted");
        stmt.run();
        console.log('db deleted');
  }

  function song_search(key)
  {
      var result = db.prepare("SELECT * FROM song WHERE " +
                              "Name like '%" + key + "%' OR "+
                              "artist like '%" + key + "%' OR " +
                              "album like '%" + key + "%'").all();
      return result;
  }

  function Display()
  {
    var result = db.prepare("SELECT * FROM song").all();
    return result;
  }

  function Disconnect()
  {
    db.close();
  }

module.exports = {create, insert, song_search, Disconnect, Display, deleteSong};
