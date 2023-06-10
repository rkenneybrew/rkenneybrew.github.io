module.exports = function isLTSFn(now) {
  return function isLTS(item) {
    return item.lts && now >= item.start && now <= item.end;
  };
};
