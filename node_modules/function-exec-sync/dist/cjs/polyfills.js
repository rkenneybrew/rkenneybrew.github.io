"use strict";
require("core-js/actual/array/from");
require("core-js/actual/map");
require("core-js/actual/set");
require("core-js/actual/url");

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}