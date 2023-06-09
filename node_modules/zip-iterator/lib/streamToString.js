var eos = require('end-of-stream');

module.exports = function streamToString(stream, callback) {
  var string = '';
  stream.on('data', function (chunk) {
    string += chunk.toString();
  });
  eos(stream, function (err) {
    err ? callback(err) : callback(null, string);
  });
};
