(function() {

  module.exports = function(params, callback) {

    var path = params.path || ".";
    var ref = params.ref || params.branch || "master";
       

    var spawn = require('child_process').spawn,
        util = require('util');
        
    var options = [];
    options.push('checkout');
    options.push(ref);
    options.push('-f');
    options.push('--');
    options.push('.');
    
    var gitcheckout =  spawn('git', options, {
      cwd: path,
      detached: false,
    });

    gitcheckout.stdout.on('data', function (buffer) {
      callback(false, buffer.toString('utf8'));
    });

    gitcheckout.stderr.on('data', function (buffer) {
      calback(true, buffer.toString('utf8'));
    });

    gitfetch.on('close', function (code) {
      if (code == 0 ) {
        console.log('GitCheckout ended successfully. ');
      } else {
        console.log('GitCheckout ended with error:', code);
      }
      
    });
    return gitcheckout;

  };

}).call(this);





