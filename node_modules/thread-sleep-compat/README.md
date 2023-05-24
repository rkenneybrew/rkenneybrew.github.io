## thread-sleep-compat

thread-sleep the runs on multiple versions of node

Please see the original [thread-sleep](https://github.com/ForbesLindesay/thread-sleep.git) module for details.

## Usage

```js
var sleep = require('thread-sleep-compat');

var start = Date.now();
var res = sleep(1000);
var end = Date.now();
// res is the actual time that we slept for
console.log(res + ' ~= ' + (end - start) + ' ~= 1000');
// tested on osx and resulted in => 1005 ~= 1010 ~= 1000
```
