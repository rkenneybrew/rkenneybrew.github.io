var path = require('path');
var mkpath = require('mkpath');
var Queue = require('queue-cb');
var assign = require('just-extend');

var chmod = require('./fs/chmod');
var chown = require('./fs/chown');
var utimes = require('./fs/utimes');
var stripPath = require('./stripPath');
var validateAttributes = require('./validateAttributes');

var MANDATORY_ATTRIBUTES = ['mode', 'mtime', 'path'];

function DirectoryEntry(attributes) {
  validateAttributes(attributes, MANDATORY_ATTRIBUTES);
  assign(this, attributes);
  if (this.type === undefined) this.type = 'directory';
  if (this.basename === undefined) this.basename = path.basename(this.path);
}

DirectoryEntry.prototype.create = function create(dest, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  var self = this;
  if (typeof callback === 'function') {
    options = options || {};
    try {
      var normalizedPath = path.normalize(self.path);
      var fullPath = path.join(dest, stripPath(normalizedPath, options));

      // do not check for the existence of the directory but allow out-of-order calling
      var queue = new Queue(1);
      queue.defer(mkpath.bind(null, fullPath));
      queue.defer(chmod.bind(null, fullPath, self, options));
      queue.defer(chown.bind(null, fullPath, self, options));
      queue.defer(utimes.bind(null, fullPath, self, options));
      return queue.await(callback);
    } catch (err) {
      return callback(err);
    }
  }

  return new Promise(function createPromise(resolve, reject) {
    self.create(dest, options, function createCallback(err, done) {
      err ? reject(err) : resolve(done);
    });
  });
};

DirectoryEntry.prototype.destroy = function destroy() {};

module.exports = DirectoryEntry;
