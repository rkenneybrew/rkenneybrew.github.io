"use strict";

const util = require("./util");

const xsh = {
  exec: require("./exec"),
  env: require("./env"),
  envPath: require("./env-path"),
  mkCmd: require("./mkcmd"),
  pathCwd: require("./path-cwd"),
  pathCwdNm: require("./path-cwd-nm"),
  $: require("shcmd")
};

Object.defineProperty(xsh, "Promise", {
  set: p => {
    util.Promise = p || Promise;
  },
  get: () => util.Promise
});

module.exports = xsh;
