var semver = require('semver');

module.exports = function match(version, comparators) {
  if (
    (comparators.eq && !semver.eq(version, comparators.eq)) ||
    (comparators.lt && !semver.lt(version, comparators.lt)) ||
    (comparators.lte && !semver.lte(version, comparators.lte)) ||
    (comparators.gt && !semver.gt(version, comparators.gt)) ||
    (comparators.gte && !semver.gte(version, comparators.gte))
  ) {
    return false;
  }
  return true;
};
