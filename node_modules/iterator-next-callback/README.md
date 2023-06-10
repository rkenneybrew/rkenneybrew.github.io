## iterator-next-callback

Calls async iterator next using a callback format.

```
var next = require('iterator-next-callback');
var assert = require('assert');

async function* createAsyncIterable(iterable) {
  for (const elem of iterable) {
    yield elem;
  }
}

var iterator = createAsyncIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
var callback = nextCallback(iterator);

callback(function (err, value) {
  assert.ok(!err);
  assert.equal(value, 1);
});

```
