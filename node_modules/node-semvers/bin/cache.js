#!/usr/bin/env node

var Cache = require('fetch-json-cache');
var exit = require('exit');
var constants = require('../lib/constants');

var cache = new Cache(constants.CACHE_DIRECTORY);

function cacheJSON(callback) {
  cache.get(constants.DISTS_URL, { force: true }, function (err) {
    err ? callback(err) : cache.get(constants.SCHEDULES_URL, { force: true }, callback);
  });
}

cacheJSON(function (err) {
  if (err) {
    console.log('Failed to cache dists and schedules. Error: ' + err.message);
    return exit(err.code || -1);
  }
  exit(0);
});
