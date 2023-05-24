## node-install-release

Cross-platform solution for installing releases of Node.js.

Code:

```
$ npm install node-install-release -g
$ nir 14
// installed to ./v14.x.x
```

Code:

```
var assert = require('assert')
var installRelease = require('node-install-release')

var installPath = path.join(INSTALLED_DIR, 'v12-darwin-x64');

// callback - choose the platform and arch
installRelease('v12', installPath, { platform: 'darwin', arch: 'x64' }, function (err, res) {
  assert.ok(!err);
});

// promise - use the local system for platform and arch
await installRelease('v12', installPath);

// promise - from source (using https://nodejs.org/dist/index.json filename)
await installRelease('v12', installPath, { filename: 'src' });
```
