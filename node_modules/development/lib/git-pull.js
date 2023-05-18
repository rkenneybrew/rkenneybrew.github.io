(function() {

  module.exports = function(params, callback) {

    var path = params.path || '.';

    var spawn = require('child_process').spawn;
    
    var options = [];
    options.push('pull');

    var gitpull =  spawn('git', options, {
      cwd: path,
      detached: false,
    });

    gitpull.stdout.on('data', function (buffer) {
      callback(false, buffer.toString('utf8'));
    });

    gitpull.stderr.on('data', function (buffer) {
      calback(true, buffer.toString('utf8'));
    });

    gitpull.on('close', function (code) {
      if (code == 0 ) {
        console.log('GitPull ended successfully. ');
      } else {
        console.log('GitPull ended with error:', code);
      }
      
    });
    return gitpull;

  };

}).call(this);


