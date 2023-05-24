var compat = require('async-compat');

var fifoRemove = require('./fifoRemove');

module.exports = function processOrQueue(iterator, callback) {
  if (iterator.done) return callback(null, null);

  // nothing to process so queue
  if (!iterator.stack.length) return iterator.queued.unshift(callback);

  // process next
  var next = iterator.stack.pop();
  iterator.processing.push(callback);
  next(iterator, function nextCallback(err, result) {
    if (iterator.done) return callback(null, null);
    fifoRemove(iterator.processing, callback);
    if (err && compat.defaultValue(iterator.options.error(err), true)) err = null; // skip error

    // done is based on stack being empty and not error state as the user may choose to skip the error
    var done = !iterator.stack.length && iterator.processing.length <= 0;
    !done && !err && !result ? processOrQueue(iterator, callback) : callback(err, result || null);
    if (done && !iterator.done) iterator.end(); // end
  });
};
