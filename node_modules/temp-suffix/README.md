## temp-suffix

Adds a unique suffix to a string with process and thread uniqueness guarantees. Adapted from https://github.com/npm/write-file-atomic

```
var tempSuffix = require(temp-suffix');
var assert = require(assert');

var tempFilename = tempSuffix(__filename);
console.log(tempFilename); // __filename + '-' + [UNIQUE SUFFIX]

var suffix = tempSuffix();
console.log(suffix); // [UNIQUE SUFFIX]
```
