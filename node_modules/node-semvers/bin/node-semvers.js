#!/usr/bin/env node

var getopts = require('getopts-compat');
var exit = require('exit');
var isArray = require('isarray');
var NodeVersions = require('..');
var isNaN = require('../lib/isNaN');

(function () {
  var options = getopts(process.argv.slice(3), {
    alias: { path: 'p', range: 'r', now: 'n' },
    stopEarly: true,
  });
  if (typeof options.now !== 'undefined') options.now = new Date(isNaN(+options.now) ? Date.parse(options.now) : +options.now);

  // define.option('-p, --path [path]', 'path within version including raw for unprocessed version', 'version');
  // define.option('-r, --range [range]', 'range type of major, minor, or patch with filters of lts, even, odd for version string expressions', 'patch');
  // define.option('-n, --now [date]', 'use a specific time as a Date.parse');

  if (options.help) {
    console.log('');
    console.log('Example call:');
    console.log('  $ nv [version string]');
    console.log('');
    console.log('Version Strings:');
    console.log('Any command that calls for a version can be provided any of the');
    console.log('following "version-ish" identifies:');
    console.log('');
    console.log('- x.y.z        A specific SemVer tuple');
    console.log('- x.y          Major and minor version number');
    console.log('- x            Just a major version number');
    console.log('- lts          The most recent LTS (long-term support) node version');
    console.log('- lts/<name>   The latest in a named LTS set. (argon, boron, etc.)');
    console.log('- lts/*        Same as just "lts"');
    console.log('- latest       The most recent (non-LTS) version');
    console.log('- stable       Backwards-compatible alias for "lts"');
    console.log('- [expression] Engine and semver module expression like "10.1.x || >=12.0.0"');
    return;
  }

  var args = process.argv.slice(2, 3).concat(options._);
  if (args.length < 1) {
    console.log('Missing version string. Example usage: nv [version string]. Use nv --help for information on version strings');
    return exit(-1);
  }

  function stringify(value) {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }

  NodeVersions.load(options, function (err, semvers) {
    if (err) {
      console.log(err.message);
      return exit(err.code || -1);
    }

    var version = semvers.resolve(args[0], options);
    if (!version || (isArray(version) && !version.length)) {
      console.log('Unrecognized: ' + args[0]);
      return exit(-1);
    }

    console.log('versions:');
    if (isArray(version)) {
      for (var index = 0; index < version.length; index++) console.log(stringify(version[index]));
    } else console.log(stringify(version));
    exit(0);
  });
})();
