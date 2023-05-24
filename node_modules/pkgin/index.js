var fs = require('fs');

var exec = require('exec');
var strsplit = require('strsplit');

var repofile = '/opt/local/etc/pkgin/repositories.conf';
var repositories;
try {
  repositories = fs.readFileSync(repofile, 'utf-8').trim().split('\n');
} catch (e) {
  repositories = e;
}

module.exports = pkgin;
module.exports.repositories = repositories;
module.exports.search = search;
module.exports.list = list;
module.exports.available = available;

// wrapper for all functions
function pkgin() {
  var action = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1);
  pkgin[action].apply(this, args);
}

// pkgin search
function search(pkg, cb) {
  var args = ['pkgin', 'search', pkg];
  _exec(args, function(err, out) {
    if (err) return cb(err);

    if (out.indexOf('No results found for') === 0)
      return cb(null, []);

    // split line by line, filtering out stuff
    var s = out.split('\n');
    s = s.filter(function(line) {
      return line
          && line.indexOf('=:') !== 0
          && line.indexOf('>:') !== 0
          && line.indexOf('<:') !== 0
    });

    // construct the return object
    var ret = [];
    s.forEach(function(line) {
      var spl = strsplit(line, undefined, 2);

      var obj = {
        name: spl[0]
      }
      switch (spl[1][0]) {
        case '>':
          obj.upgrade = -1
          obj.installed = true;
          obj.description = strsplit(line, undefined, 3)[2];
          break;
        case '<':
          obj.upgrade = 1;
          obj.installed = true;
          obj.description = strsplit(line, undefined, 3)[2];
          break;
        case '=':
          obj.upgrade = 0;
          obj.installed = true;
          obj.description = strsplit(line, undefined, 3)[2];
          break;
        default:
          obj.installed = false;
          obj.description = spl[1];
          break;
      }
      ret.push(obj);
    });

    cb(null, ret);
  });
}

// pkgin ls
function list(cb) {
  _list('list', cb);
}

// pkgin avail
function available(cb) {
  _list('available', cb);
}

// generic list function
function _list(op, cb) {
  var args = ['pkgin', op];
  _exec(args, function(err, out) {
    if (err) return cb(err);
    var ret = [];
    out.split('\n').forEach(function(line) {
      if (!line) return;
      var spl = strsplit(line, undefined, 2);
      var obj = {
        name: spl[0],
        description: spl[1]
      };
      ret.push(obj);
    });
    cb(null, ret);
  });
}

// wrapper for exec with error handling
function _exec(args, cb) {
  exec(args, function(stderr, stdout, code) {
    var err;
    if (stderr || code !== 0) {
      err = new Error('pkgin(1) produced stderr with code ' + code);
      err.stderr = stderr;
      err.stdout = stdout;
      err.code = code;
    }
    cb(err, stdout);
  });
}
