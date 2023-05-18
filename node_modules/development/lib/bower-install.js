(function() {

  module.exports = function(params, callback) {

    var path = params.path || ".";

    var spawn = require('child_process').spawn,
        util = require('util');

    var options = [];
    options.push('install');

    var bowerinstall =  spawn('bower', options, {
      cwd: path,
      detached: false,
    });

    bowerinstall.stdout.on('data', function (buffer) {
      callback(false, buffer.toString('utf8'));
    });

    bowerinstall.stderr.on('data', function (buffer) {
      callback(true, buffer.toString('utf8'));
    });

    bowerinstall.on('close', function (code) {
      if (code == 0 ) {
        console.log('bowerInstall ended successfully. ');
      } else {
        console.log('bowerInstall ended with error:', code);
      }
    });
    return bowerinstall;

  };

}).call(this);
