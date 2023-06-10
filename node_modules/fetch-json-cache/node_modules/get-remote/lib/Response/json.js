module.exports = function json(callback) {
  if (typeof callback === 'function') {
    return this.text(function (err, res) {
      if (err) return callback(err);

      try {
        res.body = JSON.parse(res.body);
        return callback(null, res);
      } catch (err) {
        return callback(err);
      }
    });
  }

  var self = this;
  return new Promise(function (resolve, reject) {
    self.json(function (err, res) {
      err ? reject(err) : resolve(res);
    });
  });
};
