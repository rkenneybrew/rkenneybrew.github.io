## node-version-use

Cross-platform solution for using multiple versions of node. Useful for compatibility testing

cli

```
# specific version
$ nvu 14.4.0 npm run test

# highest of version
$ nvu 12 npm run test

# lts
$ nvu lts npm run test

# comma-delimited list
$ nvu 0.8,4,8,14 npm run test

# use expression
$ nvu >=0.8 node --version

# use engines.node from package.json
$ nvu engines node --version
```

JavaScript

```
var assert = require('assert');
var nvu = require('node-version-use');

var NODE = process.platform === 'win32' ? 'node.exe' : 'node';

// results is an array per-version of form {version, error, result}
nvu('>=0.8', NODE, ['--version'], { versions: '12', stdio: 'inherit' }, function (err, results) {
  assert.ok(!err);
});

// results is an array per-version of form {version, error, result}
await nvu('engines', NODE, ['--version'], { versions: '12', stdio: 'inherit' });
```
