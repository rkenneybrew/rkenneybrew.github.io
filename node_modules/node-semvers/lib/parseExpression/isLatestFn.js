module.exports = function isLatestFn(now) {
  return function isLatest(item) {
    return !item.lts && now >= item.start && now <= item.end;
  };
};
