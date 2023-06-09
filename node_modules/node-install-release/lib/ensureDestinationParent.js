var path = require('path');
var mkpath = require('mkpath');

module.exports = function ensureDestinationParent(dest, callback) {
  var parent = path.dirname(dest);
  if (parent === '.' || parent === '/') return callback();
  mkpath(parent, function (err) {
    callback(err);
  });
};
