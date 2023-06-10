var nextCallback = require('iterator-next-callback');

var createProcessor = require('./createProcessor');

var DEFAULT_CONCURRENCY = 4096;
var DEFAULT_LIMIT = Infinity;
var MAXIMUM_BATCH = 10;

module.exports = function maximizeIterator(iterator, fn, options, callback) {
  if (typeof fn !== 'function') throw new Error('Missing each function');
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback === 'function') {
    options = options || {};
    options = {
      each: fn,
      callbacks: options.callbacks || options.async,
      concurrency: options.concurrency || DEFAULT_CONCURRENCY,
      limit: options.limit || DEFAULT_LIMIT,
      batch: options.batch || MAXIMUM_BATCH,
      error:
        options.error ||
        function () {
          return true; // default is exit on error
        },
      total: 0,
      counter: 0,
      stop: function (counter) {
        return counter > options.batch;
      },
    };

    var processor = createProcessor(nextCallback(iterator), options, function processorCallback(err) {
      options = null;
      processor = null;
      return callback(err);
    });
    processor();
  } else {
    return new Promise(function (resolve, reject) {
      maximizeIterator(iterator, fn, options, function (err) {
        err ? reject(err) : resolve();
      });
    });
  }
};
