var match = require('match-semver');
var find = require('lodash.find');

var FILENAMES = require('./filenames');
var PATHS = require('./paths');

module.exports = function filenameToDists(filename, version) {
  var filenames = find(FILENAMES, match.bind(null, version));
  var paths = find(PATHS, match.bind(null, version));

  var results = [];
  for (var key in filenames.map) {
    if (filenames.map[key] !== filename) continue;

    var pathsFunction = paths.map[key];
    if (!pathsFunction && ~key.indexOf('.')) {
      results.push(version + '/' + key);
    } else {
      var relativePaths = (pathsFunction || paths.map.default)(key, version);
      for (var index = 0; index < relativePaths.length; index++) {
        results.push(version + '/' + relativePaths[index]);
      }
    }
  }
  return results;
};
