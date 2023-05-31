"use strict";

const get = (name, valWhenUndef) => {
  const x = process.env[name];
  return x === undefined ? valWhenUndef : x;
};

const getAsBool = (name, valWhenUndef) => {
  const x = process.env[name];
  if (x === undefined) {
    if (typeof valWhenUndef === "boolean") {
      return valWhenUndef;
    }
    return false;
  }

  const b = x.toLowerCase();
  return b === "true" || b === "1" || b === "yes" || b === "on";
};

const getAsInt = (name, valWhenUndef) => {
  let n = NaN;
  const x = process.env[name];
  if (x !== undefined) {
    n = +x;
    if (!isNaN(n)) return n;
  }

  if (typeof valWhenUndef === "number") {
    return valWhenUndef;
  }

  return n;
};

module.exports = {
  get: get,
  getAsBool,
  getAsInt
};
