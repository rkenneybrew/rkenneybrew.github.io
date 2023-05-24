var addExtensionsFn = require('./helpers/addExtensionsFn');
var addHyphen = require('./helpers/addHyphen');
var addVersionAndArch = require('./helpers/addVersionAndArch');
var toExtension = require('./helpers/toExtension');

module.exports = {
  'tar.gz': toExtension,
  pkg: toExtension,
  default: addExtensionsFn(['.tar.gz']),
  'x86.msi': addHyphen,
  'x64/node.msi': addVersionAndArch,
};
