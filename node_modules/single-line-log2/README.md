# single-line-log2

Node.js module that keeps writing to the same line in the console (or a stream). Very useful when you write progress bars, or a status message during longer operations. Supports multilines.

This patches single-line-log for columns missing and adds line feed normalization.

## Installation

	npm install single-line-log2


## Usage

``` js
var log = require('single-line-log2').stdout;
// or pass any stream:
// var log = require('single-line-log2')(process.stdout);

var read = 0;
var size = fs.statSync('super-large-file').size;

var rs = fs.createReadStream('super-large-file');
rs.on('data', function(data) {
	read += data.length;
	var percentage = Math.floor(100*read/size);

	// Keep writing to the same two lines in the console
	log('Writing to super large file\n[' + percentage + '%]', read, 'bytes read');
});
```

## .clear()

Clears the log (i.e., writes a newline).

``` js
var log = require('single-line-log2').stdout;

log('Line 1');
log.clear();
log('Line 2');
```


## .stdout

Outputs to `process.stdout`.


## .stderr

Outputs to `process.stderr`.


## License

MIT