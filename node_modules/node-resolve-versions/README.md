## versions-string-to-versions

Convert a version expression to released Node.js versions (by full or partial semver, expression, or package.json engines.node).

```
var assert = require('assert');
var resolveVersions = require('versions-string-to-versions');

///////////////
// callback
///////////////

// version string
resolveVersions('12', function (err, versions) {
  assert.ok(!err);
  assert.equal(versions.length, 1);
  assert.equal(versions[0].slice(0, 4), 'v12.');
  done();
});

// expression
resolveVersions('>=8', { range: 'major,even' }, function (err, versions) {
  assert.ok(!err);
  assert.ok(versions.length > 1);
});

// expression
resolveVersions('12,14', function (err, versions) {
  assert.ok(!err);
  assert.ok(versions.length > 1);
});

// engines from package.json engines.node in cwd
resolveVersions('engines', function (err, versions) {
  assert.ok(!err);
  assert.ok(versions.length >= 1);
});

///////////////
// promise
///////////////

// version string
var versions = await resolveVersions('12')
assert.equal(versions.length, 1);
assert.equal(versions[0].slice(0, 4), 'v12.');

// expression
var versions = await resolveVersions('>=8', { range: 'major,even' })
assert.ok(versions.length > 1);

// expression
var versions = await resolveVersions('12,14')
assert.ok(versions.length > 1);

// engines from package.json engines.node in cwd
var versions = await resolveVersions('engines')
assert.ok(versions.length > 1);
```
