var crossSpawn = require('cross-spawn-cb');
var spawnOptions = require('./spawnOptions');

module.exports = function spawn(installPath, command, args, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback === 'function') {
    return crossSpawn(command, args, spawnOptions(installPath, options || {}), callback);
  }
  return new Promise(function (resolve, reject) {
    spawn(installPath, command, args, options, function spawnCallback(err, res) {
      err ? reject(err) : resolve(res);
    });
  });
};
