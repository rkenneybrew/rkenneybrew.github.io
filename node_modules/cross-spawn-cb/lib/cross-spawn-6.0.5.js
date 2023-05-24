'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var require$$0$2 = require('child_process');

var require$$0$1 = require('path');

var require$$0 = require('fs');

var require$$5 = require('semver');

function _interopDefaultLegacy(e) {
  return e && _typeof(e) === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var require$$0__default$2 = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);

var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

var require$$5__default = /*#__PURE__*/_interopDefaultLegacy(require$$5);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
var crossSpawn = {
  exports: {}
};
/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */

var src = function src(fn) {
  try {
    return fn();
  } catch (e) {}
};

var windows;
var hasRequiredWindows;

function requireWindows() {
  if (hasRequiredWindows) return windows;
  hasRequiredWindows = 1;
  windows = isexe;
  isexe.sync = sync;
  var fs = require$$0__default["default"];

  function checkPathExt(path, options) {
    var pathext = options.pathExt !== undefined ? options.pathExt : process.env.PATHEXT;

    if (!pathext) {
      return true;
    }

    pathext = pathext.split(';');

    if (pathext.indexOf('') !== -1) {
      return true;
    }

    for (var i = 0; i < pathext.length; i++) {
      var p = pathext[i].toLowerCase();

      if (p && path.substr(-p.length).toLowerCase() === p) {
        return true;
      }
    }

    return false;
  }

  function checkStat(stat, path, options) {
    if (!stat.isSymbolicLink() && !stat.isFile()) {
      return false;
    }

    return checkPathExt(path, options);
  }

  function isexe(path, options, cb) {
    fs.stat(path, function (er, stat) {
      cb(er, er ? false : checkStat(stat, path, options));
    });
  }

  function sync(path, options) {
    return checkStat(fs.statSync(path), path, options);
  }

  return windows;
}

var mode;
var hasRequiredMode;

function requireMode() {
  if (hasRequiredMode) return mode;
  hasRequiredMode = 1;
  mode = isexe;
  isexe.sync = sync;
  var fs = require$$0__default["default"];

  function isexe(path, options, cb) {
    fs.stat(path, function (er, stat) {
      cb(er, er ? false : checkStat(stat, options));
    });
  }

  function sync(path, options) {
    return checkStat(fs.statSync(path), options);
  }

  function checkStat(stat, options) {
    return stat.isFile() && checkMode(stat, options);
  }

  function checkMode(stat, options) {
    var mod = stat.mode;
    var uid = stat.uid;
    var gid = stat.gid;
    var myUid = options.uid !== undefined ? options.uid : process.getuid && process.getuid();
    var myGid = options.gid !== undefined ? options.gid : process.getgid && process.getgid();
    var u = parseInt('100', 8);
    var g = parseInt('010', 8);
    var o = parseInt('001', 8);
    var ug = u | g;
    var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
    return ret;
  }

  return mode;
}

var core;

if (process.platform === 'win32' || commonjsGlobal.TESTING_WINDOWS) {
  core = requireWindows();
} else {
  core = requireMode();
}

var isexe_1 = isexe$1;
isexe$1.sync = sync$1;

function isexe$1(path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided');
    }

    return new Promise(function (resolve, reject) {
      isexe$1(path, options || {}, function (er, is) {
        if (er) {
          reject(er);
        } else {
          resolve(is);
        }
      });
    });
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null;
        is = false;
      }
    }

    cb(er, is);
  });
}

function sync$1(path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {});
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false;
    } else {
      throw er;
    }
  }
}

var which_1 = which$1;
which$1.sync = whichSync;
var isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';
var path$2 = require$$0__default$1["default"];
var COLON = isWindows ? ';' : ':';
var isexe = isexe_1;

function getNotFoundError(cmd) {
  var er = new Error('not found: ' + cmd);
  er.code = 'ENOENT';
  return er;
}

function getPathInfo(cmd, opt) {
  var colon = opt.colon || COLON;
  var pathEnv = opt.path || process.env.PATH || '';
  var pathExt = [''];
  pathEnv = pathEnv.split(colon);
  var pathExtExe = '';

  if (isWindows) {
    pathEnv.unshift(process.cwd());
    pathExtExe = opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM';
    pathExt = pathExtExe.split(colon); // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.

    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '') pathExt.unshift('');
  } // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.


  if (cmd.match(/\//) || isWindows && cmd.match(/\\/)) pathEnv = [''];
  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  };
}

function which$1(cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }

  var info = getPathInfo(cmd, opt);
  var pathEnv = info.env;
  var pathExt = info.ext;
  var pathExtExe = info.extExe;
  var found = [];

  (function F(i, l) {
    if (i === l) {
      if (opt.all && found.length) return cb(null, found);else return cb(getNotFoundError(cmd));
    }

    var pathPart = pathEnv[i];
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"') pathPart = pathPart.slice(1, -1);
    var p = path$2.join(pathPart, cmd);

    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p;
    }

    (function E(ii, ll) {
      if (ii === ll) return F(i + 1, l);
      var ext = pathExt[ii];
      isexe(p + ext, {
        pathExt: pathExtExe
      }, function (er, is) {
        if (!er && is) {
          if (opt.all) found.push(p + ext);else return cb(null, p + ext);
        }

        return E(ii + 1, ll);
      });
    })(0, pathExt.length);
  })(0, pathEnv.length);
}

function whichSync(cmd, opt) {
  opt = opt || {};
  var info = getPathInfo(cmd, opt);
  var pathEnv = info.env;
  var pathExt = info.ext;
  var pathExtExe = info.extExe;
  var found = [];

  for (var i = 0, l = pathEnv.length; i < l; i++) {
    var pathPart = pathEnv[i];
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"') pathPart = pathPart.slice(1, -1);
    var p = path$2.join(pathPart, cmd);

    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p;
    }

    for (var j = 0, ll = pathExt.length; j < ll; j++) {
      var cur = p + pathExt[j];
      var is;

      try {
        is = isexe.sync(cur, {
          pathExt: pathExtExe
        });

        if (is) {
          if (opt.all) found.push(cur);else return cur;
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length) return found;
  if (opt.nothrow) return null;
  throw getNotFoundError(cmd);
}

var pathKey$1 = function pathKey$1(opts) {
  opts = opts || {};
  var env = opts.env || process.env;
  var platform = opts.platform || process.platform;

  if (platform !== 'win32') {
    return 'PATH';
  }

  return Object.keys(env).find(function (x) {
    return x.toUpperCase() === 'PATH';
  }) || 'Path';
};

var path$1 = require$$0__default$1["default"];
var which = which_1;
var pathKey = pathKey$1();

function resolveCommandAttempt(parsed, withoutPathExt) {
  var cwd = process.cwd();
  var hasCustomCwd = parsed.options.cwd != null; // If a custom `cwd` was specified, we need to change the process cwd
  // because `which` will do stat calls but does not support a custom cwd

  if (hasCustomCwd) {
    try {
      process.chdir(parsed.options.cwd);
    } catch (err) {
      /* Empty */
    }
  }

  var resolved;

  try {
    resolved = which.sync(parsed.command, {
      path: (parsed.options.env || process.env)[pathKey],
      pathExt: withoutPathExt ? path$1.delimiter : undefined
    });
  } catch (e) {
    /* Empty */
  } finally {
    process.chdir(cwd);
  } // If we successfully resolved, ensure that an absolute path is returned
  // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it


  if (resolved) {
    resolved = path$1.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
  }

  return resolved;
}

function resolveCommand$1(parsed) {
  return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

var resolveCommand_1 = resolveCommand$1;
var _escape = {}; // See http://www.robvanderwoude.com/escapechars.php

var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
  // Escape meta chars
  arg = arg.replace(metaCharsRegExp, '^$1');
  return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
  // Convert to string
  arg = "".concat(arg); // Algorithm below is based on https://qntm.org/cmd
  // Sequence of backslashes followed by a double quote:
  // double up all the backslashes and escape the double quote

  arg = arg.replace(/(\\*)"/g, '$1$1\\"'); // Sequence of backslashes followed by the end of the string
  // (which will become a double quote later):
  // double up all the backslashes

  arg = arg.replace(/(\\*)$/, '$1$1'); // All other backslashes occur literally
  // Quote the whole thing:

  arg = "\"".concat(arg, "\""); // Escape meta chars

  arg = arg.replace(metaCharsRegExp, '^$1'); // Double escape meta chars if necessary

  if (doubleEscapeMetaChars) {
    arg = arg.replace(metaCharsRegExp, '^$1');
  }

  return arg;
}

_escape.command = escapeCommand;
_escape.argument = escapeArgument;
var shebangRegex$1 = /^#!.*/;
var shebangRegex = shebangRegex$1;

var shebangCommand$1 = function shebangCommand$1(str) {
  var match = str.match(shebangRegex);

  if (!match) {
    return null;
  }

  var arr = match[0].replace(/#! ?/, '').split(' ');
  var bin = arr[0].split('/').pop();
  var arg = arr[1];
  return bin === 'env' ? arg : bin + (arg ? ' ' + arg : '');
};

var fs = require$$0__default["default"];
var shebangCommand = shebangCommand$1;

function readShebang$1(command) {
  // Read the first 150 bytes from the file
  var size = 150;
  var buffer;

  if (Buffer.alloc) {
    // Node.js v4.5+ / v5.10+
    buffer = Buffer.alloc(size);
  } else {
    // Old Node.js API
    buffer = new Buffer(size);
    buffer.fill(0); // zero-fill
  }

  var fd;

  try {
    fd = fs.openSync(command, 'r');
    fs.readSync(fd, buffer, 0, size, 0);
    fs.closeSync(fd);
  } catch (e) {
    /* Empty */
  } // Attempt to extract shebang (null is returned if not a shebang)


  return shebangCommand(buffer.toString());
}

var readShebang_1 = readShebang$1;
var path = require$$0__default$1["default"];
var niceTry = src;
var resolveCommand = resolveCommand_1;
var escape = _escape;
var readShebang = readShebang_1;
var semver = require$$5__default["default"];
var isWin$1 = process.platform === 'win32';
var isExecutableRegExp = /\.(?:com|exe)$/i;
var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i; // `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0

var supportsShellOption = niceTry(function () {
  return semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true);
}) || false;

function detectShebang(parsed) {
  parsed.file = resolveCommand(parsed);
  var shebang = parsed.file && readShebang(parsed.file);

  if (shebang) {
    parsed.args.unshift(parsed.file);
    parsed.command = shebang;
    return resolveCommand(parsed);
  }

  return parsed.file;
}

var NODES = ['node', 'node.exe', 'node.cmd'];

function parseNonShell(parsed) {
  if (!isWin$1) {
    return parsed;
  } // Detect & add support for shebangs

  var commandFile = detectShebang(parsed); // We don't need a shell if the command filename is an executable

  var needsShell = !isExecutableRegExp.test(commandFile); // If a shell is required, use cmd.exe and take care of escaping everything correctly
  // Note that `forceShell` is an hidden option used only in tests

  // KM: force node to use the shell
  if (!needsShell && NODES.indexOf(path.basename(commandFile).toLowerCase()) >=0) needsShell = true;

  if (parsed.options.forceShell || needsShell) {
    // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
    // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
    // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
    // we need to double escape them
    var needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile); // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
    // This is necessary otherwise it will always fail with ENOENT in those cases

    parsed.command = path.normalize(parsed.command); // Escape command & arguments

    parsed.command = escape.command(parsed.command);
    parsed.args = parsed.args.map(function (arg) {
      return escape.argument(arg, needsDoubleEscapeMetaChars);
    });
    var shellCommand = [parsed.command].concat(parsed.args).join(' ');
    parsed.args = ['/d', '/s', '/c', "\"".concat(shellCommand, "\"")];
    parsed.command = process.env.comspec || 'cmd.exe';
    parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
  }

  return parsed;
}

function parseShell(parsed) {
  // If node supports the shell option, there's no need to mimic its behavior
  if (supportsShellOption) {
    return parsed;
  } // Mimic node shell option
  // See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335


  var shellCommand = [parsed.command].concat(parsed.args).join(' ');

  if (isWin$1) {
    parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
    parsed.args = ['/d', '/s', '/c', "\"".concat(shellCommand, "\"")];
    parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
  } else {
    if (typeof parsed.options.shell === 'string') {
      parsed.command = parsed.options.shell;
    } else if (process.platform === 'android') {
      parsed.command = '/system/bin/sh';
    } else {
      parsed.command = '/bin/sh';
    }

    parsed.args = ['-c', shellCommand];
  }

  return parsed;
}

function parse$1(command, args, options) {
  // Normalize arguments, similar to nodejs
  if (args && !Array.isArray(args)) {
    options = args;
    args = null;
  }

  args = args ? args.slice(0) : []; // Clone array to avoid changing the original

  options = Object.assign({}, options); // Clone object to avoid changing the original
  // Build our parsed object

  var parsed = {
    command: command,
    args: args,
    options: options,
    file: undefined,
    original: {
      command: command,
      args: args
    }
  }; // Delegate further parsing to shell or non-shell

  return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

var parse_1 = parse$1;
var isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
  return Object.assign(new Error("".concat(syscall, " ").concat(original.command, " ENOENT")), {
    code: 'ENOENT',
    errno: 'ENOENT',
    syscall: "".concat(syscall, " ").concat(original.command),
    path: original.command,
    spawnargs: original.args
  });
}

function hookChildProcess(cp, parsed) {
  if (!isWin) {
    return;
  }

  var originalEmit = cp.emit;

  cp.emit = function (name, arg1) {
    // If emitting "exit" event and exit code is 1, we need to check if
    // the command exists and emit an "error" instead
    // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
    if (name === 'exit') {
      var err = verifyENOENT(arg1, parsed);

      if (err) {
        return originalEmit.call(cp, 'error', err);
      }
    }

    return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
  };
}

function verifyENOENT(status, parsed) {
  if (isWin && status === 1 && !parsed.file) {
    return notFoundError(parsed.original, 'spawn');
  }

  return null;
}

function verifyENOENTSync(status, parsed) {
  if (isWin && status === 1 && !parsed.file) {
    return notFoundError(parsed.original, 'spawnSync');
  }

  return null;
}

var enoent$1 = {
  hookChildProcess: hookChildProcess,
  verifyENOENT: verifyENOENT,
  verifyENOENTSync: verifyENOENTSync,
  notFoundError: notFoundError
};
var cp = require$$0__default$2["default"];
var parse = parse_1;
var enoent = enoent$1;

function spawn(command, args, options) {
  // Parse the arguments
  var parsed = parse(command, args, options); // Spawn the child process

  var spawned = cp.spawn(parsed.command, parsed.args, parsed.options); // Hook into child process "exit" event to emit an error if the command
  // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16

  enoent.hookChildProcess(spawned, parsed);
  return spawned;
}

function spawnSync(command, args, options) {
  // Parse the arguments
  var parsed = parse(command, args, options); // Spawn the child process

  var result = cp.spawnSync(parsed.command, parsed.args, parsed.options); // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16

  result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
  return result;
}

crossSpawn.exports = spawn;
var spawn_1 = crossSpawn.exports.spawn = spawn;
var sync = crossSpawn.exports.sync = spawnSync;

var _parse = crossSpawn.exports._parse = parse;

var _enoent = crossSpawn.exports._enoent = enoent;

exports._enoent = _enoent;
exports._parse = _parse;
exports["default"] = crossSpawn.exports;
exports.spawn = spawn_1;
exports.sync = sync;
