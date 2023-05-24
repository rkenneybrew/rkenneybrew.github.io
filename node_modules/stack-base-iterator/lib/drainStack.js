var processOrQueue = require('./processOrQueue');

function canProcess(iterator) {
  if (iterator.done || !iterator.stack.length) return false;
  if (iterator.queued.length) return true;
  if (!iterator.processors.length) return false;
  iterator.processors.first()(false);
  if (iterator.done) return false;
  return iterator.queued.length;
}

module.exports = function drainStack(iterator) {
  while (canProcess(iterator)) {
    processOrQueue(iterator, iterator.queued.pop());
  }
};
