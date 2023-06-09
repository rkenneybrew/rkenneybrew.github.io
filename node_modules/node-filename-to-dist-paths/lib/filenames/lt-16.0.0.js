var assign = require('just-extend');

module.exports = assign({}, require('./base'), {
  'tar.xz': 'src',
  headers: 'headers',
  'win-x64/node.exe': 'win-x64-exe',
  // 'win-x64/node.lib': 'win-x64-exe',
  'x64.msi': 'win-x64-msi',
  'x86.msi': 'win-x86-msi',
  'win-x86/node.exe': 'win-x86-exe',
  // 'win-x86/node.lib': 'win-x86-exe',
  'win-arm/node.exe': 'win-arm-exe',
  'win-x64.7z': 'win-x64-7z',
  'win-x86.7z': 'win-x86-7z',
  'win-arm.7z': 'win-arm-7z',
  'win-x64.zip': 'win-x64-zip',
  'win-x86.zip': 'win-x86-zip',
  'win-arm.zip': 'win-arm-zip',
});
