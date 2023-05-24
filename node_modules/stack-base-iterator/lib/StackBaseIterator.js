var FIFO = require('fifo');
var once = require('once');
var assign = require('just-extend');
var createProcesor = require('maximize-iterator/lib/createProcessor');

var fifoRemove = require('./fifoRemove');

var drainStack = require('./drainStack');
var processOrQueue = require('./processOrQueue');

function StackBaseIterator(options) {
  if (!(this instanceof StackBaseIterator)) return new StackBaseIterator(options);
  options = options || {};

  var self = this;
  self.options = assign({}, options);
  self.options.error =
    options.error ||
    function defaultError(err) {
      return !!err; // fail on errors
    };

  self.queued = FIFO();
  self.processors = FIFO();
  self.stack = FIFO();
  self.entries = FIFO();
  self.links = FIFO();
  self.processing = FIFO();
}

StackBaseIterator.prototype.destroy = function destroy(err) {
  if (this.destroyed) throw new Error('Already destroyed');
  this.destroyed = true;
  this.end(err);
};

StackBaseIterator.prototype.push = function push(item) {
  if (this.done) return console.log('Attempting to push on a done iterator');
  this.stack.push(item);
  drainStack(this);
};

StackBaseIterator.prototype.end = function end(err) {
  if (this.done) return;
  this.done = true;
  while (this.processors.length) this.processors.pop()(err || true);
  while (this.processing.length) err ? this.processing.pop()(err) : this.processing.pop()(null, null);
  while (this.queued.length) err ? this.queued.pop()(err) : this.queued.pop()(null, null);
  while (this.stack.length) this.stack.pop();
};

StackBaseIterator.prototype.next = function next(callback) {
  if (typeof callback === 'function') return processOrQueue(this, once(callback));

  var self = this;
  return new Promise(function nextPromise(resolve, reject) {
    self.next(function nextCallback(err, result) {
      err ? reject(err) : resolve(result);
    });
  });
};

StackBaseIterator.prototype.forEach = function forEach(fn, options, callback) {
  var self = this;
  if (typeof fn !== 'function') throw new Error('Missing each function');
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback === 'function') {
    if (this.done) return callback(null, true);
    options = options || {};
    options = {
      each: fn,
      callbacks: options.callbacks || false,
      concurrency: options.concurrency || 1,
      limit: options.limit || Infinity,
      error:
        options.error ||
        function defaultError() {
          return true; // default is exit on error
        },
      total: 0,
      counter: 0,
      stop: function stop() {
        return self.done || self.queued.length >= self.stack.length;
      },
    };

    var processor = createProcesor(this.next.bind(this), options, function processorCallback(err) {
      if (!self.destroyed) fifoRemove(self.processors, processor);
      processor = null;
      options = null;
      var done = !self.stack.length;
      if ((err || done) && !self.done) self.end(err);
      return callback(err, self.done || done);
    });
    this.processors.push(processor);
    processor();
    return;
  }

  return new Promise(function forEachPromise(resolve, reject) {
    self.forEach(fn, options, function forEachCallback(err, done) {
      err ? reject(err) : resolve(done);
    });
  });
};

if (typeof Symbol !== 'undefined' && Symbol.asyncIterator) {
  StackBaseIterator.prototype[Symbol.asyncIterator] = function asyncIterator() {
    var self = this;
    return {
      next: function next() {
        return self.next().then(function nextCallback(value) {
          return Promise.resolve({ value: value, done: value === null });
        });
      },
      destroy: function destroy() {
        self.destroy();
        return Promise.resolve();
      },
    };
  };
}

module.exports = StackBaseIterator;
