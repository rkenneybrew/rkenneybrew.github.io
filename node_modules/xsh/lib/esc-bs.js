"use strict";

const Path = require("path");

/* istanbul ignore next */
module.exports = Path.sep === "\\" ? x => x.replace(/\\/g, "\\\\") : x => x;
