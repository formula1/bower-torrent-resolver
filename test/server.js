'use strict';

var WebTorrent = require('webtorrent');
var Server = require('bittorrent-tracker').Server;
var path = require('path');
var fs = require('fs');

var TorrentServer;

module.exports = TorrentServer = function(dir){
  this.dir = dir;
  if(!fs.existsSync(this.dir)) fs.mkdir(this.dir);

  this.client = new WebTorrent({ dht: false });

  this.torrents = {};
  this.server = new Server({ udp:true, http: false, ws: false, filter: function(infoHash, params, cb){
      // get the number of seeders for a particular torrent
      cb(true);
    },
  });
};

TorrentServer.prototype.addPackage = function(item){
  var client = this.client;
  var torrents = this.torrents;
  var serverPort = this.__port;
  var serverhostname = this.__hostname;
  var directory = this.dir;

  return new Promise(function(res){
    client.seed(item.filename, {
      name: `${item.name}`,            // name of the torrent (default = basename of `path`)
      // comment: String,         // free-form textual comments of the author
      createdBy: 'bower-torrent=resolver-test-server',       // name and version of program used to create torrent
      // creationDate: Date       // creation time in UNIX epoch format (default = now)
      // private: Boolean,        // is this a private .torrent? (default = false)
      // pieceLength: Number      // force a custom piece length (number of bytes)
      announceList: [[`udp://${serverhostname}:${serverPort}`]], // custom trackers (array of arrays of strings) (see [bep12](http://www.bittorrent.org/beps/bep_0012.html))
      // urlList: [String]        // web seed urls (see [bep19](http://www.bittorrent.org/beps/bep_0019.html))
    }, function(torrent){
      torrents[item.name] = torrent;
      res(torrent);
    });
  });
};

TorrentServer.prototype.listen = function(port, hostname){
  var server = this.server;
  this.__port = port;
  this.__hostname = hostname = hostname || 'localhost';
  return new Promise(function(res){
    server.listen(port, hostname, function(){
      res();
    });
  });
};

TorrentServer.prototype.close = function(){
  this.server.close();
  this.client.destroy();
}
