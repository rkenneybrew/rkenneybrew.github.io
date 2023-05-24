"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return satisfiesSemverSync;
    }
});
require("./polyfills.js");
var path = require("path");
var envPathKey = require("env-path-key");
var semver = require("semver");
var constants = require("./constants");
var existsSync = require("./existsSync");
var processVersion = path.join(__dirname, "workers", "processVersion.js");
var functionExec = null; // break dependencies
function satisfiesSemverSync(versionString) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!functionExec) functionExec = require("function-exec-sync"); // break dependencies
    var _env;
    var env = (_env = options.env) !== null && _env !== void 0 ? _env : process.env;
    var pathKey = envPathKey(env);
    var envPaths = env[pathKey].split(path.delimiter);
    for(var i = 0; i < envPaths.length; i++){
        var envPath = envPaths[i];
        var execPath = path.join(envPath, constants.node);
        if (!existsSync(execPath)) continue;
        var version = functionExec({
            execPath: execPath
        }, processVersion);
        if (semver.satisfies(version, versionString)) return execPath;
    }
    return null;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}