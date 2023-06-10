var fs = require('fs');

function existsAccessSync(fullPath) {
  // eslint-disable-next-line n/no-deprecated-api
  if (fs.existsSync(fullPath)) return;

  var err = new Error("ENOENT: no such file or directory, access '" + fullPath + "'");
  err.code = 'ENOENT';
  err.errno = -2;
  throw err;
}

module.exports = fs.accessSync || existsAccessSync;
