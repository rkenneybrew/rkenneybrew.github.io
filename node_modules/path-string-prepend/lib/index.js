require('./polyfills');

var path = require('path');

function filterNone() {
  return true;
}

module.exports = function prepend(pathString, prependPath, options) {
  options = options || {};
  var delimiter = options.delimiter || path.delimiter;

  var changes = { added: [], removed: [] };
  var parts = pathString.split(delimiter);
  var filter = options.filter || filterNone;

  // add to start
  if (!parts.length || parts[0] !== prependPath) {
    changes.added.push(prependPath);
    parts.unshift(prependPath);
  }

  // remove duplicates
  for (var index = 1; index < parts.length; index++) {
    var prependPathPart = parts[index];

    // remove
    if ((prependPathPart.indexOf(prependPath) >= 0) || !filter(prependPathPart)) {
      changes.removed.push(prependPathPart);
      parts.splice(index, 1);
      index--;
    }
  }

  changes.path = parts.join(delimiter);
  return options.changes ? changes : changes.path;
};
