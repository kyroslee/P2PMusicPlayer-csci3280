var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('song.sqlite');

  function create()
  {
      db.serialize(()=>{
      db.run("CREATE TABLE if not exists song(" +
              "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
              "Name String, " +
              "artist String, " +
              "album String, " +
              "lyrics String)");
    });
  }

  function insert(song)
  {
      db.serialize(()=>{
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
        stmt.finalize();
      })
  }

  function song_search(key)
  {
      var song = new Array();
      var i = 0;
      db.serialize(()=>{
        var stmt = db.prepare("SELECT * FROM song WHERE " +
                              "Name like '%" + key + "%' OR "+
                              "artist like '%" + key + "%' OR " +
                              "album like '%" + key + "%'");
        stmt.each((err, row)=> {
            song[i] = {"name":row.Name, "artist":row.artist, "album":row.album};
            i += 1;
        });
        stmt.finalize();
      })
  }

module.exports = {create, insert, song_search};
