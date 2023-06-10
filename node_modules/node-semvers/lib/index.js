var semver = require('semver');
var Cache = require('fetch-json-cache');

var constants = require('./constants');
var keyFunctions = require('./keyFunctions');
var lineFunctions = require('./lineFunctions');
var normalizeSchedule = require('./normalizeSchedule');
var normalizeVersion = require('./normalizeVersion');
var match = require('./match');
var parseExpression = require('./parseExpression');

function NodeVersions(versions, schedule) {
  if (!versions) throw new Error('Missing option: versions');
  if (!schedule) throw new Error('Missing option: schedule');

  this.schedules = [];
  for (var name in schedule) this.schedules.push(normalizeSchedule(name, schedule[name]));
  this.schedules = this.schedules.sort(function (a, b) {
    return semver.gt(semver.coerce(a.semver), semver.coerce(b.semver)) ? 1 : -1;
  });

  this.versions = [];
  for (var index = 0; index < versions.length; index++) this.versions.push(normalizeVersion(versions[index], this.schedules));
  this.versions = this.versions.sort(function (a, b) {
    return semver.gt(a.semver, b.semver) ? -1 : 1;
  });
}

NodeVersions.load = function load(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  if (typeof callback === 'function') {
    options = options || {};

    var cache = new Cache(options.cacheDirectory || constants.CACHE_DIRECTORY);
    cache.get(constants.DISTS_URL, function (err, versions) {
      if (err) return callback(err);

      cache.get(constants.SCHEDULES_URL, function (err, schedule) {
        err ? callback(err) : callback(null, new NodeVersions(versions, schedule));
      });
    });
  } else {
    return new Promise(function (resolve, reject) {
      load(options, function loadCallback(err, NodeVersions) {
        err ? reject(err) : resolve(NodeVersions);
      });
    });
  }
};

NodeVersions.loadSync = function loadSync(options) {
  options = options || {};
  var cache = new Cache(options.cacheDirectory || constants.CACHE_DIRECTORY);
  var versions = cache.getSync(constants.DISTS_URL);
  var schedule = cache.getSync(constants.SCHEDULES_URL);
  if (!versions || !schedule) return null;
  return new NodeVersions(versions, schedule);
};

NodeVersions.prototype.resolve = function resolve(expression, options) {
  options = options || {};
  var path = options.path || 'version';

  // normalize
  if (typeof expression === 'number') expression = '' + expression;
  if (typeof expression !== 'string') return null;
  expression = expression.trim();

  // single result, try a match
  var query = parseExpression.call(this, expression, options.now || new Date());
  if (query) {
    var version = null;
    for (var index = 0; index < this.versions.length; index++) {
      var test = this.versions[index];
      if (options.now && options.now < test.date) continue;
      if (!match(test, query)) continue;
      version = test;
      break;
    }
    if (version) return version[path];
  }

  // filtered expression
  var range = options.range || '';
  var filters = { lts: !!~range.indexOf('lts') };
  filters.key = ~range.indexOf('major') ? keyFunctions.major : ~range.indexOf('minor') ? keyFunctions.minor : undefined;
  filters.line = ~range.indexOf('even') ? lineFunctions.even : ~range.indexOf('odd') ? lineFunctions.odd : undefined;

  var results = [];
  var founds = {};
  // eslint-disable-next-line no-redeclare
  for (var index = 0; index < this.versions.length; index++) {
    // eslint-disable-next-line no-redeclare
    var test = this.versions[index];
    if (options.now && options.now < test.date) continue;
    if (filters.lts && !test.lts) continue;
    if (filters.line && !filters.line(test)) continue;
    if (!semver.satisfies(test.semver, expression)) continue;
    if (filters.key) {
      if (founds[filters.key(test)]) continue;
      founds[filters.key(test)] = true;
    }
    results.unshift(test[path]);
  }
  return results;
};

module.exports = NodeVersions;
