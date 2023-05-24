require('../polyfills');

var binaryFilename = require('../binaryFilename');

var binding = require('../../out/' + binaryFilename(process.versions.node) + '/build/Release/thread_sleep.node');

module.exports = function sleep(milliseconds) {
  var start = Date.now();
  if (milliseconds !== Math.floor(milliseconds)) {
    throw new TypeError('sleep only accepts an integer number of milliseconds');
  } else if (milliseconds < 0) {
    throw new RangeError('sleep only accepts a positive number of milliseconds');
  } else if (milliseconds !== (milliseconds | 0)) {
    throw new RangeError('sleep duration out of range');
  }
  milliseconds = milliseconds | 0;
  var result = binding.sleep(milliseconds);
  var end = Date.now();
  return end - start;
};
