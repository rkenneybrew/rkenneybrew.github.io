// adapted from https://github.com/mafintosh/tar-fs

var fs = require('graceful-fs');

var UMASK = process.umask ? process.umask() : null;
var DMODE = parseInt(755, 8);
var FMODE = parseInt(644, 8);
var SMODE = parseInt(755, 8);
var LMODE = parseInt(644, 8);

module.exports = function chmodFn(fullPath, entry, options, callback) {
  // eslint-disable-next-line n/no-deprecated-api
  var chmod = entry.type === 'symlink' ? fs.lchmod : fs.chmod;
  if (!chmod || UMASK === null) return callback();

  var mode = entry.mode;
  if (!mode) {
    switch (entry.type) {
      case 'directory':
        mode = DMODE;
        break;
      case 'file':
        mode = FMODE;
        break;
      case 'symlink':
        mode = SMODE;
        break;
      case 'link':
        mode = LMODE;
        break;
    }
  }
  chmod(fullPath, mode & ~UMASK, callback);
};
