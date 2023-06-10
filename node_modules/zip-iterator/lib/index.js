var BaseIterator = require('extract-base-iterator');

module.exports = require('./ZipIterator');
module.exports.DirectoryEntry = BaseIterator.DirectoryEntry;
module.exports.FileEntry = require('./FileEntry');
module.exports.LinkEntry = BaseIterator.LinkEntry;
module.exports.SymbolicLinkEntry = BaseIterator.SymbolicLinkEntry;
