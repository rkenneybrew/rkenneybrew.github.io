"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return versionExecPath;
    }
});
var path = require("path");
var accessSync = require("fs-access-sync-compat");
var constants = require("./constants");
var existsSync = require("./existsSync");
var SLEEP_MS = 200;
var installVersion = path.join(__dirname, "installVersion.js");
var resolveVersion = null; // break dependencies
var execFunction = null; // break dependencies
function versionExecPath(versionString) {
    if (!resolveVersion) resolveVersion = require("node-resolve-versions"); // break dependencies
    if (!execFunction) execFunction = require("function-exec-sync"); // break dependencies
    var versions = resolveVersion.sync(versionString);
    if (versions.length > 1) throw new Error("Multiple versions match: " + versionString + " = " + versions.join(",") + ". Please be specific");
    var version = versions[0];
    var installPath = path.join(constants.installDirectory, version);
    var binRoot = constants.isWindows ? installPath : path.join(installPath, "bin");
    var execPath = path.join(binRoot, constants.node);
    // need to install
    if (!existsSync(execPath)) {
        execFunction({
            cwd: process.cwd(),
            sleep: SLEEP_MS,
            callbacks: true
        }, installVersion, version);
        accessSync(execPath); // confirm installed
    }
    return execPath;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}