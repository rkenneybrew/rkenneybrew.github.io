require('./polyfills');

module.exports = require('./spawnCallback');
module.exports.spawn = require('./spawnCallback');
module.exports.sync = require('./spawnSyncCallback');
