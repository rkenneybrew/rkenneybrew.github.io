"use strict";

/* eslint-disable max-statements, no-constant-condition, complexity */

const assert = require("assert");

function parse(str, noPrefix, noExtra) {
  const nest = [];
  let arr = [];
  let s = str.trim();

  if (!s) return { prefix: "", array: arr, remain: "" };

  let prefix = "";

  if (noPrefix !== true) {
    const ix = s.indexOf("[");

    if (ix > 0) {
      prefix = s.substring(0, ix).trim();
      s = s.substring(ix);
    }
  }

  while (true) {
    // start of an array
    if (s.startsWith("[")) {
      nest.push(arr);
      arr.push((arr = []));
      s = s.substring(1).trimLeft();
      continue; // handle multiple consecutive ['s like [[[a]]]
    } else {
      assert(nest.length > 0, "array missing [");
    }

    // extract non-empty element up to ] or ,
    const m = s.match(/[\],]/);
    assert(m, "array missing ]");
    const element = s.substring(0, m.index).trim();
    // if element is empty but there's , ahead then it's a legit empty element
    if (element || m[0] === ",") arr.push(element);

    s = s.substring(m.index + 1).trimLeft();

    // end of an array
    if (m[0] === "]") {
      arr = nest.pop();
      assert(arr, "array has extra ]");
      if (s.startsWith(",")) {
        s = s.substring(1).trimLeft();
      }
    }

    if (!s) break;
    if (nest.length === 0) {
      assert(noExtra !== true, "extra data at end of array");
      break;
    }
  }

  assert(nest.length === 0, "array missing ]");

  return {
    prefix,
    array: arr[0],
    remain: s
  };
}

module.exports = {
  parse
};
