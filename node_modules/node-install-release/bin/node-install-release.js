#!/usr/bin/env node

var getopts = require('getopts-compat');
var exit = require('exit');
var nir = require('..');

(function () {
  var options = getopts(process.argv.slice(3), {
    alias: { platform: 'p', arch: 'a', filename: 'f', cacheDirectory: 'c', silent: 's' },
    boolean: ['silent'],
  });

  // define.option('-p, --platform [platform]', 'Platform like darwin');
  // define.option('-a, --arch [arch]', 'Architecure x64, x86, arm-pi');
  // define.option('-f, --filename [filename]', 'Distribution filename from https://nodejs.org/dist/index.json');
  // define.option('-c, --cacheDirectory [cacheDirectory]', 'Cache directory');

  var args = process.argv.slice(2, 3).concat(options._);
  if (args.length < 1) {
    console.log('Missing command. Example usage: nir version [directory]');
    return exit(-1);
  }

  var installPath = args.length > 1 ? args[1] : null;
  nir(args[0], installPath, Object.assign({ stdio: 'inherit' }, options), function (err, results) {
    if (err) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    var errors = results.filter(function (result) {
      return !!result.error;
    });

    if (!options.silent) {
      console.log('\n======================');
      for (var index = 0; index < results.length; index++) {
        var result = results[index];
        if (result.error) console.log(result.version + ' not installed. Error: ' + result.error.message);
        else console.log(result.version + ' installed in: ' + result.fullPath);
      }
      console.log('======================');
    }

    exit(errors.length ? -1 : 0);
  });
})();
