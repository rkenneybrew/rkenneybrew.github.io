## match-semver

Checks match of version against semver comparators.

```
var assert = require('assert');
var match = once('match-semver');

assert.ok(!match('v1.0.0', { eq: 'v0.0.0' }));
assert.ok(match('v1.0.0', { eq: 'v1.0.0' }));
assert.ok(!match('v1.0.0', { eq: 'v2.0.0' }));
assert.ok(!match('v1.0.0', { gte: 'v0.0.0', lt: 'v1.0.0' }));
assert.ok(match('v1.0.0', { gte: 'v1.0.0', lt: 'v2.0.0' }));
assert.ok(match('v1.0.0', { gte: 'v0.0.0', lt: 'v2.0.0' }));
```
