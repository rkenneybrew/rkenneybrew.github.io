var path = require('path');
var fs = require('fs');
var eos = require('end-of-stream');
var mkpath = require('mkpath');

var statsBasename = require('../sourceStats/basename');
var pump = require('../utils/pump');

module.exports = function file(dest, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  var self = this;
  if (typeof callback === 'function') {
    options = Object.assign({}, this.options, options || {});
    return this.stream(options, function (err, res) {
      if (err) return callback(err);

      var basename = statsBasename(options, res, self.endpoint);
      var fullPath = basename === undefined ? dest : path.join(dest, basename);

      mkpath(path.dirname(fullPath), function (err) {
        if (err) return callback(err);

        // write to file
        res = pump(res, fs.createWriteStream(fullPath));
        eos(res, function (err) {
          err ? callback(err) : callback(null, fullPath);
        });
      });
    });
  }

  return new Promise(function (resolve, reject) {
    self.file(dest, options, function (err, res) {
      err ? reject(err) : resolve(res);
    });
  });
};
