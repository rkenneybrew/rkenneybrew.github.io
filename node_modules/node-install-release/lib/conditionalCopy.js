var access = require('fs-access-compat');

var copyFile = require('./copyFile');
var ensureDestinationParent = require('./ensureDestinationParent');

module.exports = function conditionalCopy(src, dest, optional, callback) {
  if (typeof optional === 'function') {
    callback = optional;
    optional = false;
  }

  access(dest, function (err) {
    if (!err) return callback(); // already exists

    ensureDestinationParent(dest, function (err) {
      if (err) return callback(err);
      if (!optional) return copyFile(src, dest, callback);

      access(src, function (err) {
        if (err) return callback(); // optional file missing
        copyFile(src, dest, callback);
      });
    });
  });
};
