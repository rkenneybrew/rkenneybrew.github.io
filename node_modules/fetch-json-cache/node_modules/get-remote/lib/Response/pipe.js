var eos = require('end-of-stream');

var pump = require('../utils/pump');

module.exports = function pipe(dest, callback) {
  if (typeof callback === 'function') {
    return this.stream(function (err, res) {
      if (err) {
        !dest.end || dest.end(); // cancel streaming to dest
        return callback(err);
      }

      res = pump(res, dest);
      eos(res, callback);
    });
  }

  var self = this;
  return new Promise(function (resolve, reject) {
    self.pipe(dest, function (err, res) {
      err ? reject(err) : resolve(res);
    });
  });
};
