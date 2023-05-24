var osArch = require('os').arch || require('../arch');

var PLATFORM_OS = {
  win32: 'win',
  darwin: 'osx',
};

var PLATFORM_FILES = {
  win32: ['zip', 'exe'],
  darwin: ['tar'],
};

module.exports = function prebuiltFilenames(options) {
  var platform = options.platform || process.platform;
  var os = PLATFORM_OS[platform] || platform;
  var archs = [options.arch || osArch()];
  if (platform === 'darwin' && archs[0] === 'arm64') archs.push('x64'); // fallback

  var files = PLATFORM_FILES[platform];
  var results = [];
  for (var i = 0; i < archs.length; i++) {
    if (typeof files === 'undefined') {
      results.push(os + '-' + archs[i]);
    } else {
      for (var j = 0; j < files.length; j++) {
        results.push(os + '-' + archs[i] + '-' + files[j]);
      }
    }
  }
  return results;
};
