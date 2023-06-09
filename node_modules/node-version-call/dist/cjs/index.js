"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return call;
    }
});
var versionExecPath = require("./versionExecPath.js");
var SLEEP_MS = 60;
var functionExec = null; // break dependencies
function call(version, filePath /* arguments */ ) {
    if (!functionExec) functionExec = require("function-exec-sync"); // break dependencies
    var args = Array.prototype.slice.call(arguments, 2);
    var callbacks = false;
    if (typeof version !== "string") {
        var _callbacks;
        callbacks = (_callbacks = version.callbacks) !== null && _callbacks !== void 0 ? _callbacks : false;
        version = version.version;
        // need to unwrap callbacks
        if (callbacks && version === "local") version = process.version;
    }
    // local - just call
    if (version === "local" && !callbacks) {
        var fn = require(filePath);
        return typeof fn == "function" ? fn.apply(null, args) : fn;
    } else {
        var execPath = versionExecPath(version);
        return functionExec.apply(null, [
            {
                execPath: execPath,
                env: process.env,
                cwd: process.cwd(),
                sleep: SLEEP_MS,
                callbacks: callbacks
            },
            filePath
        ].concat(args));
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}