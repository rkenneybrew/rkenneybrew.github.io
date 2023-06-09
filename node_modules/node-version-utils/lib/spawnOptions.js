var path = require('path');
var assign = require('just-extend');
var prepend = require('path-string-prepend');
var NODE = process.platform === 'win32' ? 'node.exe' : 'node';
var pathKey = require('env-path-key');
var startsCaseInsensitiveFn = require('./startsCaseInsensitiveFn');

var isWindows = process.platform === 'win32';

var startsNPM = startsCaseInsensitiveFn('npm_');
var startsPath = startsCaseInsensitiveFn('path');

module.exports = function spawnOptions(installPath, options) {
  var PATH_KEY = pathKey();
  var processEnv = process.env;
  var env = {};
  env.npm_config_binroot = isWindows ? installPath : path.join(installPath, 'bin');
  env.npm_config_root = isWindows ? installPath : path.join(installPath, 'lib');
  env.npm_config_man = isWindows ? installPath : path.join(installPath, 'man');
  env.npm_config_prefix = installPath;
  env.npm_node_execpath = path.join(env.npm_config_binroot, NODE);

  // copy the environment not for npm and skip case-insesitive additional paths
  for (var key in processEnv) {
    // skip npm_ variants and non-matching path
    if (key.length > 4 && startsNPM(key)) continue;
    if (key.length === 4 && startsPath(key) && key !== PATH_KEY) continue;
    env[key] = processEnv[key];
  }

  // override node
  if (env.NODE !== undefined) env.NODE = env.npm_node_execpath;
  if (env.NODE_EXE !== undefined) env.NODE_EXE = env.npm_node_execpath;

  // put the path to node and npm at the front and remove nvs
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', env.npm_config_binroot);
  return assign({}, options, { cwd: process.cwd(), env: env });
};
