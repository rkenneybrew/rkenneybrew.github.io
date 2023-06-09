var eos = require('end-of-stream');

module.exports = function text(callback) {
  if (typeof callback === 'function') {
    return this.stream(function (err, res) {
      if (err) return callback(err);

      // collect text
      var result = '';
      res.on('data', function (chunk) {
        result += chunk.toString();
      });
      eos(res, function (err) {
        err ? callback(err) : callback(null, { statusCode: res.statusCode, headers: res.headers, body: result });
      });
    });
  }

  var self = this;
  return new Promise(function (resolve, reject) {
    self.text(function (err, res) {
      err ? reject(err) : resolve(res);
    });
  });
};
