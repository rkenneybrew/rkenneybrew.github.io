[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url] [![devDependency Status][daviddm-dev-image]][daviddm-dev-url]

# chalker

Set ansi colors in strings using `<>` markers and [chalk].

# Usage

```js
const chalker = require("chalker");

console.log(chalker("<red.bgGreen>Red on Green Text</>"));

// with template string tagging
console.log(chalker`<green>hello world</green>`);
```

A typical use case is to easily manage colors for logs that could go to console or log servers.

```js
const msg = `<red>some error occurred...</red>`;

// log to console for visual with colors
if (!production) console.log(chalker(msg));

// log to log server with colors removed
logger.log(chalker.remove(msg));
```

# Install

```
npm i --save chalker
```

# Demo

![demo][demo]

# Marker Details

- Color markers has the `<red>red text</red>` format. You can use any valid methods [chalk] supports.

  - For example, `<blue.bold>blue bold text</blue.bold>` will colorize `blue bold text` with `chalk.blue.bold`.
  - Closing marker can be simply `</>`

- The following HTML entities escapes are supported:

  | Entity   | Character | Entity   | Character          |
  | -------- | --------- | -------- | ------------------ |
  | `&lt;`   | &lt;      | `&gt;`   | &gt;               |
  | `&amp;`  | &amp;     | `&nbsp;` | non-breaking space |
  | `&apos;` | &apos;    | `&copy;` | &copy;             |
  | `&quot;` | &quot;    | `&reg;`  | &reg;              |

- HTML escape using code points also works:

  - Hex - `&#xhhhh;` where `hhhh` is the Hex code point.
  - Decimal - `&#nnnn;` where `nnnn` is the Decimal code point.
  - ie: `&#xD83D;&#xDC69;` makes 👩

#### Advanced Chalk Colors

[Chalk advanced colors] can be applied with:

| [chalk] API     | chalker marker                                | [chalk] API       | chalker marker                                       |
| --------------- | --------------------------------------------- | ----------------- | ---------------------------------------------------- |
| `chalk.rgb`     | `<(255, 10, 20)>`, `<rgb(255,10,20)>`         | `chalk.bgRgb`     | `<bg(255, 10, 20)>`, `<bgRgb(255,10,20)>`            |
| `chalk.hex`     | `<#FF0000>`, `<hex(#FF0000)>`                 | `chalk.bgHex`     | `<bg#0000FF>`, `<bgHex(#0000FF)>`                    |
| `chalk.keyword` | `<orange>`, `<(orange)>`, `<keyword(orange)>` | `chalk.bgKeyword` | `<bg-orange>`, `<bg(orange)>`, `<bgKeyword(orange)>` |
| `chalk.hsl`     | `<hsl(32,100,50)>`                            | `chalk.bgHsl`     | `<bgHsl(32,100,50)>`                                 |
| `chalk.hsv`     | `<hsv(32,100,100)>`                           | `chalk.bgHsv`     | `<bgHsv(32,100,100)>`                                |
| `chalk.hwb`     | `<hwb(32,0,50)>`                              | `chalk.bgHwb`     | `<bgHwb(32,0,50)>`                                   |

##### More details

- a marker is tried with `chalk.keyword` if:

  - it's not detected as hex value
  - it doesn't contain params enclosed in `()`
  - it's not found as a basic color that `chalk` supports
  - for example, this is a chalk color keyword: `<orange>`
  - If it's prefixed with `"bg-"` then it's tried using `chalk.bgKeyword`

    - ie: `<bg-orange>`

- All markers can be comined with `.` in any order as long as they work with [chalk]

  - ie: `<#FF0000.bg#0000FF.bg-orange.keyword(red)>`

# APIs

### `chalker`

```js
chalker(str, [chalkInstance]);
```

- `str` - String with chalker color markers
- `chalkInstance` - Optional custom instance of [chalk].
  - ie: created from `new chalk.constructor({level: 2})`

**Returns:** A string with terminal/ansi color codes

> If `chalk.supportsColor` is `false`, then it will simply remove the `<>` markers and decode HTML entities only.

### `chalker.remove`

```js
chalker.remove(str, keepHtml);
```

- `str` - String with chalker color markers
- `keepHtml` - If `true`, then don't decode HTML entity escapes.

Simply remove all chalker markers and return the plain text string, with HTML escapes decoded.

**Returns**: A plain text string without chalker color markers

### `chalker.decodeHtml`

```js
chalker.decodeHtml(str);
```

- `str` - String to decode HTML entities

**Returns**: String with HTML entities escapes decoded

# License

Copyright (c) 2019-present, Joel Chen

Licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

---

[demo]: ./images/demo.png
[chalk]: https://www.npmjs.com/package/chalk
[chalk advanced colors]: https://github.com/chalk/chalk#256-and-truecolor-color-support
[travis-image]: https://travis-ci.org/jchip/chalker.svg?branch=master
[travis-url]: https://travis-ci.org/jchip/chalker
[npm-image]: https://badge.fury.io/js/chalker.svg
[npm-url]: https://npmjs.org/package/chalker
[daviddm-image]: https://david-dm.org/jchip/chalker/status.svg
[daviddm-url]: https://david-dm.org/jchip/chalker
[daviddm-dev-image]: https://david-dm.org/jchip/chalker/dev-status.svg
[daviddm-dev-url]: https://david-dm.org/jchip/chalker?type=dev
