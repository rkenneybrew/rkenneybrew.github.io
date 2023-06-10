"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return functionExecSync;
    }
});
require("./polyfills.js");
var fs = require("fs");
var path = require("path");
var cp = require("child_process");
var tmpdir = require("os").tmpdir || require("os-shim").tmpdir;
var suffix = require("temp-suffix");
var serialize = require("serialize-javascript");
var mkdirp = require("mkdirp");
var shortHash = require("short-hash");
var sleep = require("thread-sleep-compat");
var DEFAULT_SLEEP_MS = 100;
var NODES = [
    "node",
    "node.exe",
    "node.cmd"
];
var isWindows = process.platform === "win32";
// @ts-ignore
var unlinkSafe = require("./unlinkSafe.js");
function functionExecSync(options, filePath /* arguments */ ) {
    var args = Array.prototype.slice.call(arguments, 2);
    var _env, _cwd;
    var workerData = {
        filePath: filePath,
        args: args,
        callbacks: options.callbacks || false,
        env: (_env = options.env) !== null && _env !== void 0 ? _env : process.env,
        cwd: (_cwd = options.cwd) !== null && _cwd !== void 0 ? _cwd : process.cwd()
    };
    var _name;
    var name = (_name = options.name) !== null && _name !== void 0 ? _name : "exec-worker-sync";
    var temp = path.join(tmpdir(), name, shortHash(workerData.cwd));
    var input = path.join(temp, suffix("input"));
    var output = path.join(temp, suffix("output"));
    var done = path.join(temp, suffix("done"));
    // store data to a file
    mkdirp.sync(path.dirname(input));
    fs.writeFileSync(input, serialize(workerData), "utf8");
    unlinkSafe(output);
    // call the function
    var execPath = options.execPath || process.execPath;
    var worker = path.join(__dirname, "worker.js");
    // only node
    if (NODES.indexOf(path.basename(execPath).toLowerCase()) < 0) throw new Error("Expecting node executable. Received: ".concat(path.basename(execPath)));
    // exec and start polling
    if (!cp.execFileSync) {
        var _sleep;
        var sleepMS = (_sleep = options.sleep) !== null && _sleep !== void 0 ? _sleep : DEFAULT_SLEEP_MS;
        var cmd = '"'.concat(execPath, '" "').concat(worker, '" "').concat(input, '" "').concat(output, '"');
        cmd += "".concat(isWindows ? "&" : ";", ' echo "done" > ').concat(done);
        cp.exec(cmd);
        while(!fs.existsSync(done)){
            sleep(sleepMS);
        }
    } else {
        cp.execFileSync(execPath, [
            worker,
            input,
            output
        ]);
    }
    unlinkSafe(input);
    unlinkSafe(done);
    // get data and clean up
    var res;
    try {
        res = eval("(".concat(fs.readFileSync(output, "utf8"), ")"));
        unlinkSafe(output);
    } catch (err) {
        throw new Error("function-exec-sync: Error: ".concat(err.message, ". Function: ").concat(filePath, ". Exec path: ").concat(execPath));
    }
    // throw error from the worker
    if (res.error) {
        var error = new Error(res.error.message);
        for(var key in res.error)error[key] = res.error[key];
        throw error;
    }
    // return the result
    return res.value;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}