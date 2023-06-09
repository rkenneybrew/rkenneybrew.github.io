module.exports = function match(test, query) {
  for (var key in query) {
    if (test[key] !== query[key]) return false;
  }
  return true;
};
