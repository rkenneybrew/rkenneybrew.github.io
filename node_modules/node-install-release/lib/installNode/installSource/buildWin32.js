var path = require('path');
var spawn = require('cross-spawn-cb');
var Queue = require('queue-cb');

var access = require('fs-access-compat');
var conditionalCopy = require('../../conditionalCopy');

module.exports = function installWin32(buildPath, dest, options, callback) {
  var buildSource = path.join(buildPath, 'out', 'Release', 'node.exe');
  var buildTarget = path.join(dest, 'node.exe');

  access(buildTarget, function (err) {
    if (!err) return callback(); // already exists

    var queue = new Queue(1);
    queue.defer(function (callback) {
      access(buildSource, function (err) {
        if (!err) return callback(); // already exists
        spawn('./vcbuild', [], { stdio: 'inherit', cwd: buildPath }, callback);
      });
    });
    queue.defer(conditionalCopy.bind(null, buildSource, buildTarget));
    queue.await(callback);
  });
};
