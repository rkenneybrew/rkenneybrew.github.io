## cross-spawn-cb

Cross spawn with a completion callback

```
var assert = require('assert');
var spawn = require('cross-spawn-cb');

spawn('node', ['--version'], { stdio: 'inherit' }, function (err, res) {
  assert.ok(!err);
  done();
});
```
