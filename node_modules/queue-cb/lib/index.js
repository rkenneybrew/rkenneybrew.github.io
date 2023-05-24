var Fifo = require('fifo');

module.exports = function Queue(parallelism) {
  if (typeof parallelism === 'undefined') parallelism = Infinity;

  var awaitCalled = false;
  var awaitCallback = null;
  function callAwait() {
    if (awaitCalled || !awaitCallback) return;
    awaitCalled = true;
    return awaitCallback(error);
  }

  var tasks = Fifo();
  var runningCount = 0;
  var error = null;
  function queueCallback(err) {
    runningCount--;
    if (err && !error) error = err;
    if (error || !(tasks.length + runningCount)) return callAwait();
    if (!tasks.length) return;
    runningCount++;
    tasks.shift()(queueCallback);
  }

  return {
    defer: function defer(deferFn) {
      if (error) return;
      if (runningCount < parallelism) {
        runningCount++;
        deferFn(queueCallback);
      } else tasks.push(deferFn);
    },
    await: function awaitFn(callback) {
      if (awaitCallback) throw new Error('Awaiting callback was added twice: ' + callback);
      awaitCallback = callback;
      if (error || !(tasks.length + runningCount)) return callAwait();
    },
  };
};
