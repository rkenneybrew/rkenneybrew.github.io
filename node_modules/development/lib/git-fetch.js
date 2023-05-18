(function() {

  module.exports = function(params, callback) {
    var spawn = require('child_process').spawn;
    
    var path = params.path || ".";

    var options = [];
    options.push('fetch');
    options.push('--all');

    
    var gitfetch =  spawn('git', options, {
      cwd: path,
      detached: false,
    });

    gitfetch.stdout.on('data', function (buffer) {
      callback(false, buffer.toString('utf8'));
    });

    gitfetch.stderr.on('data', function (buffer) {
      calback(true, buffer.toString('utf8'));
    });

    gitfetch.on('close', function (code) {
      if (code == 0 ) {
        console.log('GitFetch ended successfully. ');
      } else {
        console.log('GitFetch ended with error:', code);
      }
      
    });
    return gitfetch;

  };

}).call(this);


