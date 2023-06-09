module.exports = function fifoRemove(fifo, value) {
  for (var node = fifo.node; node; node = fifo.next(node)) {
    if (node.value === value) {
      fifo.remove(node);
      return true;
    }
  }
  return false;
};
