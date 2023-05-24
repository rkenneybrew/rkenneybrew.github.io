var path = require('path');
var extract = require('fast-extract');
var mkpath = require('mkpath');
var access = require('fs-access-compat');

var progress = require('./progress');

var major = +process.versions.node.split('.')[0];
var minor = +process.versions.node.split('.')[1];
var callExtract = path.join(__dirname, 'callExtract.js');

var call = null; // break dependencies
module.exports = function conditionalExtract(src, dest, options, callback) {
  if (!call) call = require('node-version-call'); // break dependencies

  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};

  access(dest, function (err) {
    if (!err) return callback(); // already exists

    mkpath(path.dirname(dest), function () {
      var extractOptions = Object.assign({ strip: 1, progress: progress, time: 1000 }, options);

      // TODO: yauzl does not read the master record properly on Node 0.8
      if (major === 0 && minor <= 8 && path.extname(src) === '.zip') {
        try {
          delete extractOptions.progress;
          call({ version: 'lts', callbacks: true }, callExtract, src, dest, extractOptions);
          console.log('');
          callback();
        } catch (err) {
          callback(err);
        }
      } else {
        extract(src, dest, extractOptions, function (err) {
          console.log('');
          callback(err);
        });
      }
    });
  });
};
