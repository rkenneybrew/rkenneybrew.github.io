## async-compat

Compatibility functions for writing libraries that support synchronous, callback and promise signatures.

It handles both the call signature differences between callback and promises APIs (eg. missing the last callback parameter) by converting them to callbacks. It also resolves returned parameters when promises are returned.

```
var compat = require('async-compat');
var assert = require(assert');

/////////////////
// synchronous
/////////////////
function fn(value1) {
  assert.equal(value1, 1);
  return 4;
}

compat.asyncFunction(fn, false /* no callbacks */, 1, function (err, result) {
  assert.ok(!err);
  assert.equal(result, 4);
});

function errorFn(value1) {
  assert.equal(value1, 1);
  return new Error('Failed');
}

compat.asyncFunction(errorFn, false /* no callbacks */, 1, function (err, result) {
  assert.ok(!!err);
});

/////////////////
// callback
/////////////////
function callbackFn(value1, callback) {
  assert.equal(value1, 1);
  callback(null, 4);
}

compat.asyncFunction(callbackFn, true /*  no callbacks */, 1, function (err, result) {
  assert.ok(!err);
  assert.equal(result, 4);
});

function errorCallbackFn(value1, callback) {
  assert.equal(value1, 1);
  callback(new Error('Failed'));
}

compat.asyncFunction(errorCallbackFn, true /*  no callbacks */, 1, function (err, result) {
  assert.ok(!!err);
});

/////////////////
// promise
/////////////////
function promiseFn(value1) {
  assert.equal(value1, 1);
  return Promise.resolve(4);
}

compat.asyncFunction(promiseFn, false /* no callbacks */, 1, function (err, result) {
  assert.ok(!err);
  assert.equal(result, 4);
});

function errorPromiseFn(value1) {
  assert.equal(value1, 1);
  return Promise.reject(new Error('Failed'));
}

compat.errorPromiseFn(promiseFn, false /* no callbacks */, 1, function (err, result) {
  assert.ok(!!err);
});
```
