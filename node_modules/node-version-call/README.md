## node-version-call

Call a function in a specific version of node

### Example 1

```typescript
import call from 'node-version-call';

const result = call('0.8', 'path/to/file.js', 'arg1', 2);
console.log(result); // return value
```

### Example 2

```javascript
var call = require('node-version-call'); // old js calling lts js

var result = call('lts', 'path/to/file.js', 'arg1', 2);
console.log(result); // return value
```

### Documentation

[API Docs](https://kmalakoff.github.io/node-version-call/)
