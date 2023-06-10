var path = require('path');
var Queue = require('queue-cb');
var conditionalCopy = require('../conditionalCopy');

var PLATFORM_FILES = {
  win32: [
    { src: path.join('node_modules', 'npm', 'bin', 'npm'), dest: 'npm' },
    { src: path.join('node_modules', 'npm', 'bin', 'npm.cmd'), dest: 'npm.cmd' },
    { src: path.join('node_modules', 'npm', 'bin', 'npx'), dest: 'npx', optional: true },
    { src: path.join('node_modules', 'npm', 'bin', 'npx.cmd'), dest: 'npx.cmd', optional: true },
  ],
  posix: [
    { src: path.join('node_modules', 'npm', 'bin', 'npm-cli.js'), dest: 'npm' },
    { src: path.join('node_modules', 'npm', 'bin', 'npx-cli.js'), dest: 'npx', optional: true },
  ],
};

module.exports = function installBin(version, dest, options, callback) {
  var platform = options.platform || process.platform;
  var libPath = platform === 'win32' ? dest : path.join(dest, 'lib');
  var binPath = platform === 'win32' ? dest : path.join(dest, 'bin');

  var queue = new Queue();
  var files = PLATFORM_FILES[platform] || PLATFORM_FILES.posix;
  for (var index = 0; index < files.length; index++) {
    var file = files[index];
    queue.defer(conditionalCopy.bind(null, path.join(libPath, file.src), path.join(binPath, file.dest), file.optional));
  }

  queue.await(callback);
};
