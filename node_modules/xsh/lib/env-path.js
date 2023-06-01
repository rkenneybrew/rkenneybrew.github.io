"use strict";

const Path = require("path");
const pathDelim = Path.delimiter;

/* istanbul ignore next */
const defaultEnvKey = process.platform === "win32" ? "Path" : "PATH";

function findEnvKey(env, key) {
  if (!key || !env.hasOwnProperty(key)) {
    for (const x of Object.keys(env)) {
      if (x.toLowerCase() === "path") {
        key = x;
        break;
      }
    }
  }

  return key;
}

const envKey = findEnvKey(process.env, defaultEnvKey);

function check(env) {
  // allow calls like this: envPath.add("addition_path", "existing_path");
  if (typeof env === "string") {
    env = { [envKey]: env };
  } else if (!env) {
    env = process.env;
  }

  return env;
}

function addToFront(p, env) {
  env = check(env);

  let update = env[envKey] || "";

  if (typeof p === "string" && p && update.indexOf(p) !== 0) {
    update = update.trim();
    const paths = update.split(pathDelim).filter(x => x && x !== p);
    paths.unshift(p);
    update = paths.join(pathDelim);
  }

  env[envKey] = update;

  return update;
}

function addToEnd(p, env) {
  env = check(env);

  let update = env[envKey] || "";

  if (typeof p === "string" && p) {
    update = update.trim();
    const paths = update.split(pathDelim).filter(x => x && x !== p);
    paths.push(p);
    update = paths.join(pathDelim);
  }

  env[envKey] = update;

  return update;
}

function add(p, env) {
  env = check(env);

  let update = env[envKey] || "";

  if (typeof p === "string" && p) {
    update = update.trim();
    const paths = update.split(pathDelim).filter(x => x);
    if (paths.indexOf(p) < 0) {
      paths.push(p);
      update = paths.join(pathDelim);
    }
  }

  env[envKey] = update;

  return update;
}

module.exports = {
  addToFront,
  addToEnd,
  add,
  envKey,
  findEnvKey
};
