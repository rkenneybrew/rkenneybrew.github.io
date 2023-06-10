## maximize-iterator

Maximize the parallel calls of an iterator supporting asyncIterator interface.

```
const maximize = require('maximize-iterator');

(async ()=> {
  // run 1024 in parallel until done - promises
  var iterator = // create it somehow with a next method returing {done: value: }
  await maximize(iterator, (value) => { /* do something including false stop */ }, { concurrency: 1024, limit: Infinity, error: (err) => { return true; /* filter errors */ } });
})();

// run 1024 in parallel until done - callbacks
var iterator = // create it somehow with a next method returing {done: value: }
maximize(iterator, (value) => { /* do something including false stop */ }, { concurrency: 1024, limit: Infinity,  error: (err) => { return true; /* filter errors */ } }, (err) => {
  /* done */
});
```

**forEach Options**:

- bool: callbacks - use an each function with a callback `function(entry, callback)` (default: false)
- number: concurrency - parallelism of processing. (default: Infinity)
- number: limit - maximum number to process. (default: Infinity)
- number: batch - per batch count to limit expansion. (default: 10)
