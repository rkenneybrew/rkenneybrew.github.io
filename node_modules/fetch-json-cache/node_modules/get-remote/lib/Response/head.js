module.exports = function head(callback) {
  if (typeof callback === 'function') {
    return this.stream({ method: 'HEAD' }, function (err, res) {
      if (err) return callback(err);

      res.resume(); // Discard response
      callback(null, { statusCode: res.statusCode, headers: res.headers });
    });
  }

  var self = this;
  return new Promise(function (resolve, reject) {
    self.head(function (err, res) {
      err ? reject(err) : resolve(res);
    });
  });
};
