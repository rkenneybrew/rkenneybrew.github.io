"use strict";

function mkCmd(a) {
  return Array.isArray(a) ? a.join(" ") : Array.prototype.slice.call(arguments).join(" ");
}

module.exports = mkCmd;
