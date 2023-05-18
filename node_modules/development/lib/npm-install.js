(function() {

  module.exports = function(params, callback) {

    var path = params.path || ".";
   
    var spawn = require('child_process').spawn,
        util = require('util');

    var options = [];
    options.push('install');
    
    var npminstall =  spawn('npm', options, {
      cwd: path,
      detached: false,
    });

    npminstall.stdout.on('data', function (buffer) {
      callback(false, buffer.toString('utf8'));
    });

    npminstall.stderr.on('data', function (buffer) {
      calback(true, buffer.toString('utf8'));
    });

    npminstall.on('close', function (code) {
      if (code == 0 ) {
        console.log('npmInstall ended successfully. ');
      } else {
        console.log('npmInstall ended with error:', code);
      }
      
    });
    return npminstall;

  };

}).call(this);
