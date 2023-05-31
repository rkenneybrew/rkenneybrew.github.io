"use strict";

const pathCwd = require("./path-cwd");
const Path = require("path");
const escBs = require("./esc-bs");
const normNm = escBs(Path.normalize("/node_modules/"));
const normNmReplacer = Path.normalize("/~/");

const makeNmRegex = () => escBs(Path.resolve("node_modules"));

module.exports = {
  remove: (p, flags) => {
    const nmRegex = new RegExp(makeNmRegex(), flags || "");
    p = p.replace(nmRegex, "");
    return pathCwd.remove(p, flags);
  },
  replace: (p, str, flags) => {
    if (typeof str !== "string") {
      str = Path.join(`CWD`, `~`);
    }
    const nmRegex = new RegExp(makeNmRegex(), flags || "");
    p = pathCwd.replace(p.replace(nmRegex, str), null, flags);
    return p.replace(new RegExp(normNm, flags), normNmReplacer);
  }
};
