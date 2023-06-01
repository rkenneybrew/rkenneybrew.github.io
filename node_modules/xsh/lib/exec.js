"use strict";

const shell = require("shcmd");
const util = require("./util");
const assert = require("assert");

function exec() {
  const error = (cmd, code, output) => {
    const err = new Error(`shell cmd '${cmd}' exit code ${code}`);
    err.output = output;
    err.code = code;
    return err;
  };

  const len = arguments.length;

  let cb;
  let options;

  const cmdFragments = [];
  for (let i = 0; i < len; i++) {
    const arg = arguments[i];
    const tof = typeof arg;
    if (tof === "string" || Array.isArray(arg)) {
      cmdFragments.push(arg);
    } else if (tof === "function") {
      assert(i + 1 === len, "xsh.exec: callback must be the last argument");
      cb = arg;
    } else if (arg.constructor.name === "Boolean" || arg.constructor.name === "Object") {
      assert(
        i === 0 || len - i === 1 || len - i === 2,
        "xsh.exec: options must be the first, last, or second to last argument"
      );
      options = arg;
    } else {
      throw new Error("xsh.exec: command fragment must be an array or string");
    }
  }

  if (!options) {
    options = { silent: false };
  } else if (options.constructor.name === "Boolean") {
    options = { silent: options };
  }

  if (cmdFragments.length < 1) {
    throw new Error("xsh.exec: expects at least one command fragment");
  }

  let s = "";
  const cmd = cmdFragments.reduce((a, x) => {
    if (Array.isArray(x)) {
      x = x.join(" ");
    }
    a = `${a}${s}${x}`;
    s = " ";
    return a;
  }, "");

  const doExec = xcb =>
    shell.exec(cmd, Object.assign({ async: true }, options), (code, stdout, stderr) => {
      const output = { stdout, stderr };
      const err = code === 0 ? null : error(cmd, code, output);
      xcb(err, output);
    });

  if (cb) {
    return doExec(cb);
  }

  let child;

  assert(util.Promise, "xsh.exec: No Promise available - see doc on setting one");
  const promise = new util.Promise((resolve, reject) => {
    child = doExec((err, output) => (err ? reject(err) : resolve(output)));
  });

  return {
    then: (a, b) => promise.then(a, b),
    catch: a => promise.catch(a),
    promise,
    child,
    stdout: child.stdout,
    stderr: child.stderr
  };
}

module.exports = exec;
