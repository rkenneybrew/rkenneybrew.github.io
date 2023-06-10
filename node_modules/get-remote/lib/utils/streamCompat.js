var fs = require('fs');
var path = require('path');
var tmpdir = require('os').tmpdir || require('os-shim').tmpdir;
var suffix = require('temp-suffix');
var mkdirp = require('mkdirp');

var Response = require('../Response');

module.exports = function streamCompat(args, options, callback) {
  delete args[1].progress;

  if (options.method === 'HEAD') {
    new Response(args[0], args[1]).stream(options, function (err, res) {
      if (err) return callback(err);

      res.resume(); // Discard response
      callback(null, { statusCode: res.statusCode, headers: res.headers });
    });
  } else {
    const name = 'get-remote';
    const filename = path.join(tmpdir(), name, suffix('compat'));
    mkdirp.sync(path.dirname(filename));
    var res = fs.createWriteStream(filename);

    new Response(args[0], args[1]).pipe(res, function (err) {
      if (err) return callback(err);

      err ? callback(err) : callback(null, { statusCode: res.statusCode, headers: res.headers, filename: filename });
    });
  }
};
