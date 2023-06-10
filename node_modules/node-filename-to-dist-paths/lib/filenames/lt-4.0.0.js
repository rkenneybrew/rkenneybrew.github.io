var assign = require('just-extend');

module.exports = assign({}, require('./base'), {
  'node.exe': 'win-x86-exe',
  headers: 'headers',
  'x64.msi': 'win-x64-msi',
  'x86.msi': 'win-x86-msi',
  // 'node.exp': 'win-x86-exe',
  // 'node.lib': 'win-x86-exe',
  // 'openssl-cli.exe': 'win-x86-exe',
  // 'openssl-cli.pdb': 'win-x86-exe',
  'x64/node.exe': 'win-x64-exe',
  // 'x64/node.exp': 'win-x64-exe',
  // 'x64/node.lib': 'win-x64-exe',
  // 'x64/openssl-cli.exe': 'win-x64-exe',
  // 'x64/openssl-cli.pdb': 'win-x64-exe',
});
