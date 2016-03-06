var Server = require('./server');
var path = require('path');
var fs = require('fs');
var dirCompare = require('dir-compare');
var tap = require('tap');

var testTmp = path.join(__dirname,'./dist');
if(!fs.existsSync(testTmp)) fs.mkdirSync(testTmp);


/*
  Starting My server
  Adding My package

  test the magnet uri tester - not sure how to do this

  Starting my client
  Requesting the package with my client
  Check to see the filecontents are the same

  Create a simple bower Package
  Add the magnet uri to the

  Starting my client
  Requesting the package with my client
  Check to see the filecontents are the same

*/


var server;
var torrent;
var uri;
tap.test('creating server', {bail : true}, function(t){
  server = new Server(path.join(testTmp, './torrents'));
  t.ok(server, 'server created');
  return server.listen(8080,'localhost').then(function(){
    t.end()
  })
}).then(function(){
  return tap.test('adding the folder', {bail : true}, function(t){
    return server.addPackage({
      name : 'ascli',
      filename : path.join(__dirname,'./ascli')
    }).then(function(tor){
      var Resolver = require('../index.js');
      t.ok(Resolver.prototype.match(tor.magnetURI), 'magnet uri passes');
      t.equal(tor.files.length, 6, 'The correct number of files exist');
      uri = tor.magnetURI;
      torrent = tor;
      t.end();
    });
  })
}).then(function(){
  return Promise.all([tap.test('resolving works', {bail : true}, function(t){
      var Resolver = require('../index.js');
      return Resolver.prototype.fetch(uri).then(function(resolvedConfig){
        var diff = dirCompare.compareSync(resolvedConfig.tempPath, path.join(__dirname,'./ascli'));
        t.ok(diff.equal, 'The directories should be exactly the same');
      }).then(function(){
        t.end();
      });
    }), tap.comment('installing from a bower package works')
  ]);
}).then(function(){
  return new Promise(function(res,rej){
    require('rimraf')(testTmp,function(err){
      if(err) return rej(err);
      res();
    });
  });
}).then(function(argument) {
  server.close();
  tap.end();
}).catch(tap.threw.bind(tap));
