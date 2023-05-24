var isError = require('is-error');
var isPromise = require('is-promise');

module.exports = function asyncValue(value, callback) {
  if (isError(value)) return callback(value);
  if (isPromise(value)) {
    return value
      .then(function (result) {
        callback(null, result);
      })
      .catch(function (err) {
        callback(err);
      });
  }
  return callback(null, value);
};
