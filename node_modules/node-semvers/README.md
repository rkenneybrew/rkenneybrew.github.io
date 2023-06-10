## node-semvers

Resolves individual and ranges for versions of Node.js by version numbers, version names, codenames, and expressions.

Follows a similar convention to [nave](https://github.com/isaacs/nave) with the addition of semver expressions:

```
- x.y.z         A specific SemVer tuple
- x.y           Major and minor version number
- x             Just a major version number
- lts           The most recent LTS (long-term support) node version
- lts/<name>    The latest in a named LTS set. (argon, boron, etc.)
- lts/*         Same as just "lts"
- latest        The most recent (non-LTS) version
- stable        Backwards-compatible alias for "lts".
- [expression]  Engine and semver module expression like "10.1.x || >=12.0.0"
```

Usage:

```
var assert = require('assert')
var NodeVersions = require('node-semvers')

NodeVersions.load(function (err, semvers) {
  var version = semvers.resolve('lts');
  assert.equal(version, 'v12.14.0');
});

NodeVersions.load().then((semvers) => {
  const versions = semvers.resolve('10.0.0 || ~12.0.0');
  assert.deepEqual(versions, ['v10.0.0', 'v12.0.0']);
});

```
