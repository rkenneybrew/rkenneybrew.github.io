## queue-cb

A scalable queue for parallel callbacks.

The API is similar to https://github.com/d3/d3-queue, but without accumulating results in memory.

```
var Queue = require('queue-cb);

function delayedHello(callback) {
  setTimeout(function() {
    console.log("Hello!");
    callback(null);
  }, 250);
}

var q = new Queue();
q.defer(delayedHello);
q.defer(delayedHello);
q.await(function(error) {
  if (error) throw error;
  console.log("Goodbye!");
});
```
