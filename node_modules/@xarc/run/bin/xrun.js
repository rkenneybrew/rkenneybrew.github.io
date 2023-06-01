#!/usr/bin/env node

const { detectRequirePrefix } = require("./prefix");
const prefix = detectRequirePrefix();

const checkGlobal = require(`${prefix}/cli/check-global`);
const xrun = require(`${prefix}/cli/xrun`);

if (checkGlobal()) {
  setTimeout(() => xrun(), 2000);
} else {
  xrun();
}
