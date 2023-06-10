var major = +process.versions.node.split('.')[0];
var minor = +process.versions.node.split('.')[1];

if (major > 0 || minor >= 12) {
  module.exports = require('thread-sleep');
} else {
  try {
    module.exports = require('./thread-sleep');
  } catch (err) {
    console.log(err);
    module.exports = function () {};
  }
}
