var path = require('path');
var mkpath = require('mkpath');
var Queue = require('queue-cb');
var assign = require('just-extend');

var chmod = require('./fs/chmod');
var chown = require('./fs/chown');
var rimraf = require('rimraf');
var utimes = require('./fs/utimes');
var stripPath = require('./stripPath');
var validateAttributes = require('./validateAttributes');

var MANDATORY_ATTRIBUTES = ['mode', 'mtime', 'path'];

function FileEntry(attributes) {
  validateAttributes(attributes, MANDATORY_ATTRIBUTES);
  assign(this, attributes);
  if (this.basename === undefined) this.basename = path.basename(this.path);
  if (this.type === undefined) this.type = 'file';
  if (this._writeFile === undefined) throw new Error('File self missing _writeFile. Please implement this method in your subclass');
}

FileEntry.prototype.create = function create(dest, options, callback) {
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

      var queue = new Queue(1);
      if (options.force) {
        queue.defer(function (callback) {
          rimraf(fullPath, function (err) {
            err && err.code !== 'ENOENT' ? callback(err) : callback();
          });
        });
      }
      queue.defer(mkpath.bind(null, path.dirname(fullPath)));
      queue.defer(this._writeFile.bind(this, fullPath, options));
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

FileEntry.prototype.destroy = function destroy() {};

module.exports = FileEntry;
