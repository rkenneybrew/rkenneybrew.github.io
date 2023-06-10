var fs = require('fs');

function existsAccess(fullPath, callback) {
  // eslint-disable-next-line n/no-deprecated-api
  fs.exists(fullPath, function existsAccess(exists) {
    if (exists) return callback();
    var err = new Error("ENOENT: no such file or directory, access '" + fullPath + "'");
    err.code = 'ENOENT';
    err.errno = -2;
    callback(err);
  });
}

module.exports = fs.access || existsAccess;
