var assign = require('just-extend');

module.exports = assign({}, require('./lt-16.0.0.js'), {
  'darwin-arm64': 'osx-arm64-tar',
});
