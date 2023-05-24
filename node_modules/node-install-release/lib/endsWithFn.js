var isArray = require('isarray');
var endsWith = require('end-with');

module.exports = function endsWithFn(endings) {
  if (!isArray(endings)) endings = [endings];
  return function (string) {
    for (var index = 0; index < endings.length; index++) {
      if (endsWith(string, endings[index])) return true;
    }
    return false;
  };
};
