var crossSpawn = require('cross-spawn-cb');
var spawnOptions = require('./spawnOptions');

module.exports = function spawnSync(installPath, command, args, options) {
  return crossSpawn.sync(command, args, spawnOptions(installPath, options));
};
