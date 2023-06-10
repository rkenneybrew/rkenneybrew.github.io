var cp = require('child_process');

module.exports = function execCallback(cmd, options, callback) {
  return cp.exec(cmd, options, callback);
};
