'use strict';

// Constants:
var SOURCE_MATCH_REGEX = /^magnet:\?xt=urn:[a-z]+:(?:[a-zA-Z0-9]|%[A-F0-9]{2}){20,50}(?:\&[a-z0-9]+=(?:[a-zA-Z0-9]|%[A-F0-9]{2})+)*$/i;

// Dependencies:
var magnet = require('magnet-uri');
var WebTorrent = require('webtorrent');
var tmp = require('tmp');
var path = require('path');

var Resolver;

module.exports = Resolver = function(bower){
  this.bower = bower;
};
Resolver.prototype.match  = function(source) {
  if(!SOURCE_MATCH_REGEX.test(source)) return false;
  var uri = magnet(source);
  if(
    (!uri.announce || uri.announce.length === 0) &&
    (!uri.urlList || uri.urlList.length === 0)
  ) return false;
  return true;
}
Resolver.prototype.fetch = function(endpoint, cache) {
  if(cache && cache.resolution) return;
  var tempDir = tmp.dirSync();

  var pkgFolder;
  var client;
  var ret;
  return new Promise(function(res,rej){
    client = new WebTorrent({ dht: false });
    client.add(endpoint, { path: tempDir.name }, res);
    client.on('error', rej);
  }).then(function(torrent){
    ret = { tempPath : path.resolve(tempDir.name, torrent.name) };
    return new Promise(function(res,rej){
      client.destroy(function(err){
        if(err) return rej(err);
        res(ret)
      });
    });
  });
}
