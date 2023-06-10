var path = require('path');
var assign = require('just-extend');
var fs = require('graceful-fs');
var mkpath = require('mkpath');
var rimraf = require('rimraf');
var Queue = require('queue-cb');

var chmod = require('./fs/chmod');
var chown = require('./fs/chown');
var utimes = require('./fs/utimes');
var stripPath = require('./stripPath');
var validateAttributes = require('./validateAttributes');

var MANDATORY_ATTRIBUTES = ['mode', 'mtime', 'path', 'linkpath'];

function LinkEntry(attributes, type) {
  validateAttributes(attributes, MANDATORY_ATTRIBUTES);
  assign(this, attributes);
  if (this.basename === undefined) this.basename = path.basename(this.path);
  if (this.type === undefined) this.type = 'link';
}

LinkEntry.prototype.create = function create(dest, options, callback) {
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
      var normalizedLinkpath = path.normalize(self.linkpath);
      var linkFullPath = path.join(dest, stripPath(normalizedLinkpath, options));

      var queue = new Queue(1);
      if (options.force) {
        queue.defer(function (callback) {
          rimraf(fullPath, function (err) {
            err && err.code !== 'ENOENT' ? callback(err) : callback();
          });
        });
      }
      queue.defer(mkpath.bind(null, path.dirname(fullPath)));
      queue.defer(fs.link.bind(fs, linkFullPath, fullPath));
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

LinkEntry.prototype.destroy = function destroy() {};

module.exports = LinkEntry;
