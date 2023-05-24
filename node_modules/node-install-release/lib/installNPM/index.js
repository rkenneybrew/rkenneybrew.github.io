var installBin = require('./installBin');
var installLib = require('./installLib');

module.exports = function install(version, dest, options, callback) {
  installLib(version, dest, options, function (err) {
    if (err) return callback(err);
    installBin(version, dest, options, callback);
  });
};
