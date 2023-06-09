## get-remote

Download a text, json, a file with optional extract, get a stream, or head an endpoint.

Callbacks

```
var assert = require('assert')
var get = require('get-remote'))

// get stream
get('http://api.com/fixture.json').stream(function (err, stream) {
  assert.ok(!err);
  // do something
});

// get and extract
get('http://api.com/fixture.tar.gz').extract(process.cwd(), { strip: 1 }, function (err) {
  assert.ok(!err);
  // do something
});

// get to file with inferred name of 'fixture.json'
get('http://api.com/fixture.json').file(process.cwd(), function (err) {
  assert.ok(!err);
  // do something
});

// head the endpoint
get('http://api.com/fixture.json').head(function (err, res) {
  assert.ok(!err);
  assert.equal(res.statusCode, 200);
  assert.ok(!!res.headers);
});

// get json
get('http://api.com/fixture.json').json(function (err, res) {
  assert.ok(!err);
  assert.ok(!!res.headers);
  assert.ok(!!res.statusCode);
  assert.ok(!!res.body);
  // do something with res.body
});

// pipe to write stream
get('http://api.com/fixture.json').pipe(fs.createWriteStream(path.join(process.cwd(), 'fixture.json')), function (err) {
  assert.ok(!err);
  // do someting
});

// get text
get('http://api.com/fixture.text').text(function (err, res) {
  assert.ok(!!res.headers);
  assert.ok(!!res.statusCode);
  assert.ok(!!res.body);
  // do something with res.body
});


// get and extract - callbacks
get('https://cdn.jsdelivr.net/gh/nodejs/Release@main/schedule.json').extract(fullPath, { strip: 1 }, function(err) {
  assert.ok(!err)
  // do something
})
```

Promises

```
var assert = require('assert')
var get = require('get-remote'))

// get stream
var stream = await get('http://api.com/fixture.json').stream();

// get and extract
await get('http://api.com/fixture.tar.gz').extract(process.cwd(), { strip: 1 });

// get to file with inferred name of 'fixture.json'
await get('http://api.com/fixture.json').file(process.cwd());

// get to file with explicit name of 'get.json'
await get('http://api.com/fixture.json').file(process.cwd(), {filename: 'get.json'});

// head the endpoint
var res = await get('http://api.com/fixture.json').head(function (err, res) {
assert.equal(res.statusCode, 200);
assert.ok(!!res.headers);

// get json
var res = await get('http://api.com/fixture.json').json();
assert.ok(!!res.headers);
assert.ok(!!res.statusCode);
assert.ok(!!res.body);

// pipe to write stream
await get('http://api.com/fixture.json').pipe(fs.createWriteStream(path.join(process.cwd(), 'fixture.json'))));

// get text
var res = await get('http://api.com/fixture.text').text();
assert.ok(!!res.headers);
assert.ok(!!res.statusCode);
assert.ok(!!res.body);
```
