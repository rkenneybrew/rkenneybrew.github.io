var stringWidth = require('string-width');
var cr = require('cr');

var MOVE_LEFT = new Buffer('1b5b3130303044', 'hex').toString();
var MOVE_UP =   new Buffer('1b5b3141', 'hex').toString();
var CLEAR_LINE = new Buffer('1b5b304b', 'hex').toString();

module.exports = function (stream) {
  var write = stream.write;
  var str;

  stream.write = function (data) {
    if (str && data !== str) str = null;
    return write.apply(this, arguments);
  };

  if (stream === process.stderr || stream === process.stdout) {
    process.on('exit', function () {
      if (str !== null) stream.write('');
    });
  }

  var prevLineCount = 0;
  var log = function () {
    // Clear screen
    str = '';
    for (var i = 0; i < prevLineCount; i++) {
      str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount - 1 ? MOVE_UP : '');
    }

    // Actual log output
    var nextStr = cr(Array.prototype.join.call(arguments, ' '));
    str += nextStr;
    stream.write(str);

    // How many lines to remove on next clear screen
    var columns = stream.columns || 80;
    var prevLines = nextStr.split('\n');
    prevLineCount = 0;

    // eslint-disable-next-line no-redeclare
    for (var i = 0; i < prevLines.length; i++) {
      prevLineCount += Math.ceil(stringWidth(prevLines[i]) / columns) || 1;
		}
  };

  log.clear = function () {
    stream.write('');
  };

  return log;
};

module.exports.stdout = module.exports(process.stdout);
module.exports.stderr = module.exports(process.stderr);
