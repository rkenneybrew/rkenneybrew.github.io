var compat = require('async-compat');
var isError = require('is-error');

function processDone(err, options, callback) {
  // mark this iteration done
  options.err = options.err || err;
  options.done = true;

  // process done
  if (!options.done || options.counter > 0) return false;
  callback(options.err, options.done);
  return true;
}

function processResult(err, keep, options, callback) {
  options.counter--;

  // mark this iteration done
  if ((err && compat.defaultValue(options.error(err), false)) || (!err && !compat.defaultValue(keep, true))) {
    options.err = options.err || err;
    options.done = true;
  }

  // process done
  if (!options.done || options.counter > 0) return false;
  callback(options.err, options.done);
  return true;
}

module.exports = function createProcessor(next, options, callback) {
  var isProcessing = false;
  return function processor(doneOrErr) {
    if (doneOrErr && processDone(isError(doneOrErr) ? doneOrErr : null, options, callback)) return;
    if (isProcessing) return;
    isProcessing = true;

    var counter = 0;
    while (options.counter < options.concurrency) {
      if (options.done || options.stop(counter++)) break;
      if (options.total >= options.limit) return processDone(null, options, callback);
      options.total++;
      options.counter++;

      next(function (err, value) {
        if (err || value === null) {
          return !processResult(err, false, options, callback) && !isProcessing ? processor() : undefined;
        }
        compat.asyncFunction(options.each, options.callbacks, value, function (err, keep) {
          return !processResult(err, keep, options, callback) && !isProcessing ? processor() : undefined;
        });
      });
    }

    isProcessing = false;
  };
};
