"use strict";
require("./polyfills");
var fs = require("fs");
var serialize = require("serialize-javascript");
var compat = require("async-compat");
var input = process.argv[2];
var output = process.argv[3];
function writeResult(result) {
    fs.writeFile(output, serialize(result), "utf8", function() {
        process.exit(0);
    });
}
function writeError(error) {
    var result = {
        error: {
            message: error.message,
            stack: error.stack
        }
    };
    for(var key in error)result.error[key] = error[key];
    writeResult(result);
}
// get data
try {
    var workerData = eval("(".concat(fs.readFileSync(input, "utf8"), ")"));
    // set up env
    if (process.cwd() !== workerData.cwd) process.chdir(workerData.cwd);
    for(var key in workerData.env){
        if (process.env[key] === undefined) process.env[key] = workerData.env[key];
    }
    // call function
    var fn = require(workerData.filePath);
    if (typeof fn !== "function") {
        writeResult({
            value: fn
        });
    } else {
        var args = [
            fn,
            workerData.callbacks
        ].concat(workerData.args);
        args.push(function(err, value) {
            err ? writeError(err) : writeResult({
                value: value
            });
        });
        compat.asyncFunction.apply(null, args);
    }
} catch (err) {
    writeError(err);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}