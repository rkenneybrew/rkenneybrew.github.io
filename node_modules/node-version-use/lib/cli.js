var getopts = require('getopts-compat');
var exit = require('exit');
var nvs = require('..');

module.exports = function cli(argv, name) {
  var options = getopts(argv.slice(1), {
    alias: { range: 'r', desc: 'd', silent: 's' },
    default: { range: 'major,even' },
    boolean: ['silent', 'desc'],
    stopEarly: true,
  });

  // define.option('-r, --range [range]', 'range type of major, minor, or patch with filters of lts, even, odd for version string expressions', 'major,even');
  // define.option('-s, --silent', 'suppress logging', false);
  options.sort = options.desc ? -1 : 1;

  var args = argv.slice(0, 1).concat(options._);
  if (args.length < 1) {
    console.log('Missing command. Example usage: ' + name + ' [version expression] [command]');
    return exit(-1);
  }

  if (!options.silent)
    options.header = function (version, command, args) {
      console.log('\n----------------------');
      console.log([command].concat(args).join(' ') + ' (' + version + ')');
      console.log('----------------------');
    };

  options.stdio = 'inherit'; // pass through stdio
  nvs(args[0], args[1], args.slice(2), options, function (err, results) {
    if (err) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    var errors = results.filter(function (result) {
      return !!result.error;
    });

    if (!options.silent) {
      console.log('\n======================');
      if (errors.length) {
        console.log('Errors (' + errors.length + ')');
        for (var index = 0; index < errors.length; index++) {
          var result = errors[index];
          console.log(result.version + ' Error: ' + result.error.message);
        }
      } else console.log('Success (' + results.length + ')');
      console.log('======================');
    }

    exit(errors.length ? -1 : 0);
  });
};
