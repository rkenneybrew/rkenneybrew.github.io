var once = require('once');
var path = require('path');
var compact = require('lodash.compact');
var yauzl = require('yauzl');

var BaseIterator = require('extract-base-iterator');
var DirectoryEntry = BaseIterator.DirectoryEntry;
var FileEntry = require('./FileEntry');
var LinkEntry = BaseIterator.LinkEntry;
var SymbolicLinkEntry = BaseIterator.SymbolicLinkEntry;

var streamToString = require('./streamToString');
var parseExternalFileAttributes = require('./parseExternalFileAttributes');

function nextEntry(iterator, callback) {
  var extract = iterator.lock.extract;
  if (!extract) return callback(new Error('Extract missing'));

  var _callback = callback;
  callback = once(function callback(err, entry) {
    extract.removeListener('entry', onEntry);
    extract.removeListener('error', onError);
    extract.removeListener('end', onEnd);

    // keep processing
    if (entry) iterator.stack.push(nextEntry);

    // use null to indicate iteration is complete
    _callback(err, err || !entry ? null : entry);
  });

  var onError = callback;
  var onEnd = callback.bind(null, null);
  var onEntry = function onEntry(header) {
    if (iterator.done) return callback(null, null);

    var attributes = parseExternalFileAttributes(header.externalFileAttributes, header.versionMadeBy >> 8);
    attributes.path = compact(header.fileName.split(path.sep)).join(path.sep);
    attributes.mtime = yauzl.dosDateTimeToDate(header.lastModFileDate, header.lastModFileTime);

    switch (attributes.type) {
      case 'directory':
        return callback(null, new DirectoryEntry(attributes));
      case 'symlink':
      case 'link':
        return extract.openReadStream(header, function (err, stream) {
          if (err || iterator.done) return callback(err, null);

          streamToString(stream, function (err, string) {
            if (err || iterator.done) return callback(err, null);

            attributes.linkpath = string;
            var Link = attributes.type === 'symlink' ? SymbolicLinkEntry : LinkEntry;
            callback(null, new Link(attributes));
          });
        });
      case 'file':
        return callback(null, new FileEntry(attributes, iterator.lock, header));
    }

    return callback(new Error('Unrecognized entry type: ' + attributes.type));
  };

  extract.on('entry', onEntry);
  extract.on('error', onError);
  extract.on('end', onEnd);
  extract.readEntry();
}

module.exports = nextEntry;
