## node-filename-to-dist-paths

Converts files from https://nodejs.org/dist/index.json into relative distribution paths for download from https://nodejs.org/dist/.

```
var distPaths = require('node-filename-to-dist-paths');

console.log(distPaths('win-x64-exe', 'v14.2.0'));
// [ 'v14.2.0/win-x64/node.exe' ]

console.log(distPaths('osx-x64-tar', 'v14.2.0'));
// [
//  'v14.2.0/node-v14.2.0-darwin-x64.tar.gz',
//  'v14.2.0/node-v14.2.0-darwin-x64.tar.xz'
// ]

console.log(distPaths('win-x64-exe', 'v0.6.18'));
// [ 'v0.6.18/x64/node.exe' ]

console.log(distPaths('osx-x64-tar', 'v0.6.18'));
// [ 'v0.6.18/node-v0.6.18-darwin-x64.tar.gz' ]
```
