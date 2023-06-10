var log = require('single-line-log2').stdout;

module.exports = function progress(entry) {
  var message = entry.progress + ' ' + entry.basename;
  if (entry.percentage) message += ' - ' + entry.percentage.toFixed(0) + '%';
  log(message);
};
