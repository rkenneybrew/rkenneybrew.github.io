module.exports = function addExtensionsFn(extensions) {
  return function addExtensions(key, version) {
    var results = [];
    for (var index = 0; index < extensions.length; index++) {
      results.push(['node-' + version + '-' + key + extensions[index]]);
    }
    return results;
  };
};
