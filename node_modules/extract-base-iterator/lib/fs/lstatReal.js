var fs = require('graceful-fs');

module.exports = function lstatReal(path, callback) {
  fs.realpath(path, function realpathCallback(err, realpath) {
    err ? callback(err) : fs.lstat(realpath, callback);
  });
};
