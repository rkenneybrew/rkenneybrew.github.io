var extract = require('fast-extract');

module.exports = function callExtract(src, dest, options, callback) {
  extract(src, dest, options, callback);
};
