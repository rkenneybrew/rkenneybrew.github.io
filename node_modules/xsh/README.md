[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url] [![devDependency Status][daviddm-dev-image]][daviddm-dev-url]

# xsh

Some random NodeJS helper functions for shell execution

## Install

```bash
npm install xsh --save-dev
```

## Usage

```js
const xsh = require("xsh");

xsh.exec("echo hello");
```

## API

### `Promise`

You can set a custom `Promise` with:

```js
xsh.Promise = require("bluebird");
```

Or set to the native `Promise` with:

```js
xsh.Promise = null;
```

### [mkCmd](#mkcmd)

```js
xsh.mkCmd(["echo", "hello"]);
xsh.mkCmd("echo", "hello");
```

Both return the string `"echo hello"`.

### [exec](#exec)

```js
xsh.exec(shellCommand, [options], [callback] );
```

Use [shelljs `exec`] to execute `shellCommand` in `async` mode.

#### Arguments

-   `shellCommand` - can be combination of multiple strings and arrays.  Array is joined with `" "` into strings.  All final strings are joined with `" "`.

-   `options` - optional `options`

    -   If it's either `true` or `false`, it sets `silent` flag for output to console.
    -   It can also be an object that's passed to [NodeJS exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback).
        -   For example, it can be `{silent: true}`
    -   This can be the first, last, or second to last (if last is the callback) argument.

-   `callback` - optional, if provided, it will be called as follows:

`callback( code !== 0 ? new Error("...") : undefined, { stdout, stderr } )`

`error.output` is set to `{ stdout, stderr}`.
`error.code` is set to `code`.

#### Returns

-   With callback - The `child` object returned by `exec`

-   Without callback - An object with following:

```js
{
  then, catch, promise, child, stdout, stderr
}
```

Where:

-   `then` - a wrapper function for calling the `promise.then`
-   `catch` - a wrapper function for calling the `promise.catch`
-   `promise` - rejects with the error or resolves with `{ stdout, stderr }`
-   `child` - the child from `exec`
-   `stdout` and `stderr` - alias to `child.stdout` and `child.stderr`

#### exec Examples

-   With Promise:

```js
xsh.exec("echo hello").then(r => { console.log("result", r.stdout); });
```

-   With `options`:

```js
xsh.exec("pwd", {cwd: "/tmp"}).then(r => { console.log("result", r.stdout)})
```

-   With callback:

```js
xsh.exec("echo hello", (r) => {console.log("result", r.stdout)})
```

-   `shellCommand` as a combination of strings and array of strings:

```js
xsh.exec("echo", ["hello", "world"], {silent: false})
```

Would run shell command: `echo hello world`

### [envPath.addToFront](#envpathaddtofront)

```js
xsh.envPath.addToFront(path, [env]);
```

Add `path` to the front of `process.env.PATH`.  If it already exists, then it is moved to the front.

If you don't want to operate on `process.env` you can pass in a second argument that's either an object or a string that's the path to change.

### [envPath.addToEnd](#envpathaddtoend)

```js
xsh.envPath.addToEnd(path, [env]);
```

Add `path` to the end of `process.env.PATH`.  If it already exists, then it is moved to the end.

If you don't want to operate on `process.env` you can pass in a second argument that's either an object or a string that's the path to change.

### [envPath.add](#envpathadd)

```js
xsh.envPath.add(path, [env]);
```

If `path` doesn't exist in `process.env.PATH` then it's added to the end.

If you don't want to operate on `process.env` you can pass in a second argument that's either an object or a string that's the path to change.

### [`$`](#)

An instance of [shelljs].

```js
const xsh = require("xsh");
xsh.$.cd("/tmp");
```

[shelljs `exec`]: http://documentup.com/shelljs/shelljs#execcommand--options--callback

[shelljs]: https://github.com/shelljs/shelljs

[travis-image]: https://travis-ci.org/jchip/xsh.svg?branch=master

[travis-url]: https://travis-ci.org/jchip/xsh

[npm-image]: https://badge.fury.io/js/xsh.svg

[npm-url]: https://npmjs.org/package/xsh

[daviddm-image]: https://david-dm.org/jchip/xsh/status.svg

[daviddm-url]: https://david-dm.org/jchip/xsh

[daviddm-dev-image]: https://david-dm.org/jchip/xsh/dev-status.svg

[daviddm-dev-url]: https://david-dm.org/jchip/xsh?type=dev
