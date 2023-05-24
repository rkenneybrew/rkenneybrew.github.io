var semver = require('semver');

module.exports = function sortFn(options) {
  // unique and sorted
  var sort = typeof options.sort === 'undefined' ? 1 : options.sort;
  if (sort < 1) {
    return options.path === 'raw'
      ? function (a, b) {
          return semver.gt(a.version, b.version) ? -1 : 1;
        }
      : function (a, b) {
          return semver.gt(a, b) ? -1 : 1;
        };
  } else {
    return options.path === 'raw'
      ? function (a, b) {
          return semver.gt(a.version, b.version) ? 1 : -1;
        }
      : function (a, b) {
          return semver.gt(a, b) ? 1 : -1;
        };
  }
};
