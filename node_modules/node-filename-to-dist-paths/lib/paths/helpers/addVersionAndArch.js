module.exports = function addVersionAndArch(key, version) {
  var arch = key.split('/')[0];
  var parts = key.split('.');
  return [parts[0] + '-' + version + '-' + arch + '.' + parts[1]];
};
