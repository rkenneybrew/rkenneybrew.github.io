## stack-base-iterator

Base iterator for values retrieved using a stack of async functions returning values.

// asyncIterator

```js
var assert = require('assert');
var BaseIterator = require('stack-base-iterator'));

// extend BaseIterator (see tests, tar-iterator, zip-iterator for examples)

(async function() {
  var iterator = new YourIterator();

  try {
    for await (const value of iterator) {
      // do something
    }
  } catch (err) {
    assert.ok(!err);
  }

  iterator.destroy();
  iterator = null;
})();
```

// Async / Await

```js
var assert = require('assert');
var BaseIterator = require('stack-base-iterator'));

// extend BaseIterator (see tests, tar-iterator, zip-iterator for examples)

var iterator = new YourIterator();

// one by one
(async function() {
  let iterator = new YourIterator();

  try {
    let value = await iterator.next();
    while (value) {
      // do something
      value = await iterator.next();
    }
  } catch (err) {
    assert.ok(!err);
  }

  iterator.destroy();
  iterator = null;
})();

// infinite concurrency
(async function() {
  let iterator = new YourIterator();

  try {
    await iterator.forEach(
      async function (value) {
        // do something
      },
      { concurrency: Infinity }
    );
  } catch (err) {
    assert.ok(!err);
  }

  iterator.destroy();
  iterator = null;
})();
```

// Callbacks

```js
var assert = require('assert');
var Queue = require('queue-cb');
var BaseIterator = require('stack-base-iterator'));

// extend BaseIterator (see tests, tar-iterator, zip-iterator for examples)

var iterator = new YourIterator();

// one by one
var links = [];
iterator.forEach(
  function (value, callback) {
    // do something
    callback();
  },
  { callbacks: true, concurrency: 1 },
  function (err) {
    assert.ok(!err);

    iterator.destroy();
    iterator = null;
  }
);

```
