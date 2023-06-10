var startsCaseInsensitiveFn = require('./startsCaseInsensitiveFn');

var startsPath = startsCaseInsensitiveFn('path');

function windowsPathKey(env) {
  var pathKey = 'Path';
  for (var key in env) {
    if (key.length === 4 && startsPath(key)) {
      pathKey = key; // match https://github.com/sindresorhus/path-key reseveersee search
    }
  }
  return pathKey;
}

module.exports = function (options) {
  var platform = options ? options.platform || process.platform : process.platform;
  if (platform !== 'win32') return 'PATH';
  var env = options ? options.env || process.env : process.env;
  return windowsPathKey(env);
};
