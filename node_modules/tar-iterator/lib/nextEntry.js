var once = require('once');
var path = require('path');
var compact = require('lodash.compact');
var assign = require('just-extend');

var BaseIterator = require('extract-base-iterator');
var DirectoryEntry = BaseIterator.DirectoryEntry;
var FileEntry = require('./FileEntry');
var LinkEntry = BaseIterator.LinkEntry;
var SymbolicLinkEntry = BaseIterator.SymbolicLinkEntry;

function nextEntry(next, iterator, callback) {
  var extract = iterator.extract;
  if (!extract) return callback(new Error('Extract missing'));

  var _callback = callback;
  callback = once(function callback(err, entry, next) {
    extract.removeListener('entry', onEntry);
    extract.removeListener('error', onError);
    extract.removeListener('finish', onEnd);

    // keep processing
    if (entry) iterator.stack.push(nextEntry.bind(null, next));

    // use null to indicate iteration is complete
    _callback(err, err || !entry ? null : entry);
  });

  var onError = callback;
  var onEnd = callback.bind(null, null);
  var onEntry = function onEntry(header, stream, next) {
    if (iterator.done) return callback(null, null, next);

    var attributes = assign({}, header);
    attributes.path = compact(header.name.split(path.sep)).join(path.sep);
    attributes.mtime = new Date(attributes.mtime);

    switch (attributes.type) {
      case 'directory':
        stream.resume(); // drain stream
        return callback(null, new DirectoryEntry(attributes), next);
      case 'symlink':
        stream.resume(); // drain stream
        attributes.linkpath = header.linkname;
        return callback(null, new SymbolicLinkEntry(attributes), next);
      case 'link':
        stream.resume(); // drain stream
        attributes.linkpath = header.linkname;
        return callback(null, new LinkEntry(attributes), next);
      case 'file':
        return callback(null, new FileEntry(attributes, stream, iterator.lock), next);
    }

    stream.resume(); // drain stream
    return callback(new Error('Unrecognized entry type: ' + attributes.type), null, next);
  };

  extract.on('entry', onEntry);
  extract.on('error', onError);
  extract.on('finish', onEnd);
  if (next) next();
}

module.exports = nextEntry;
