var inherits = require('inherits');
var BaseIterator = require('extract-base-iterator');
var fs = require('fs');
var eos = require('end-of-stream');

var waitForAccess = require('./waitForAccess');

function FileEntry(attributes, lock, header) {
  BaseIterator.FileEntry.call(this, attributes);
  this.lock = lock;
  this.lock.retain();
  this.header = header;
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
      if (self.lock) {
        self.lock.release();
        self.lock = null;
      }
      callback(err);
    });
  }

  return new Promise(function createPromise(resolve, reject) {
    self.create(dest, options, function createCallback(err, done) {
      err ? reject(err) : resolve(done);
    });
  });
};

FileEntry.prototype._writeFile = function _writeFile(fullPath, options, callback) {
  if (!this.lock || !this.lock.extract) return callback(new Error('Zip FileEntry missing lock.extract. Check for calling create multiple times'));

  var self = this;
  var extract = this.lock.extract;
  var lock = this.lock;
  this.lock = null;
  extract.openReadStream(this.header, function (err, stream) {
    if (err) {
      self.lock = lock;
      return callback(err);
    }

    var res = stream.pipe(fs.createWriteStream(fullPath));
    eos(res, function (err) {
      self.lock = lock;
      err ? callback(err) : waitForAccess(fullPath, callback); // gunzip stream returns prematurely occassionally
    });
  });
};

FileEntry.prototype.destroy = function destroy() {
  BaseIterator.FileEntry.prototype.destroy.call(this);
  if (this.lock) {
    this.lock.release();
    this.lock = null;
  }
};

module.exports = FileEntry;
