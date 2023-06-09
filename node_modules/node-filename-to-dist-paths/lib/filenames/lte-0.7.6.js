var assign = require('just-extend');

module.exports = assign({}, require('./base'), {
  'node.exe': 'win-x86-exe',
  // 'node.lib': 'win-x86-exe',
  'x64/node.exe': 'win-x64-exe',
  // 'x64/node.lib': 'win-x64-exe',
  'x64/node.msi': 'win-x64-msi',
});
