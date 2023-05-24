module.exports = function toExtension(key, version) {
  return ['node-' + version + '.' + key];
};
