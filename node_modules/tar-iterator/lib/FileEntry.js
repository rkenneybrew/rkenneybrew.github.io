var inherits = require('inherits');
var BaseIterator = require('extract-base-iterator');
var fs = require('fs');
var eos = require('end-of-stream');

var waitForAccess = require('./lib/waitForAccess');

function FileEntry(attributes, stream, lock) {
  BaseIterator.FileEntry.call(this, attributes);
  this.stream = stream;
  this.lock = lock;
  this.lock.retain();
}

inherits(FileEntry, BaseIterator.FileEntry);

FileEntry.prototype.create = function create(dest, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  var self = this;
  if (typeof callback === 'function') {
    options = options || {};
    return BaseIterator.FileEntry.prototype.create.call(this, dest, options, function createCallback(err) {
      callback(err);
      if (self.lock) {
        self.lock.release();
        self.lock = null;
      }
    });
  }

  return new Promise(function createPromise(resolve, reject) {
    self.create(dest, options, function createCallback(err, done) {
      err ? reject(err) : resolve(done);
    });
  });
};

FileEntry.prototype._writeFile = function _writeFile(fullPath, options, callback) {
  if (!this.stream) return callback(new Error('Zip FileEntry missing stream. Check for calling create multiple times'));

  var stream = this.stream;
  this.stream = null;
  var res = stream.pipe(fs.createWriteStream(fullPath));
  eos(res, function (err) {
    err ? callback(err) : waitForAccess(fullPath, callback); // gunzip stream returns prematurely occassionally
  });
};

FileEntry.prototype.destroy = function destroy() {
  BaseIterator.FileEntry.prototype.destroy.call(this);
  if (this.stream) {
    this.stream.resume(); // drain stream
    this.stream = null;
  }
  if (this.lock) {
    this.lock.release();
    this.lock = null;
  }
};

module.exports = FileEntry;
