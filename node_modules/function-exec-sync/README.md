## function-exec-sync

Call a function in a specific version of node for browser and node

### Example 1

```typescript
import call from 'function-exec-sync';

const result = call('0.8', 'path/to/file.js', 'arg1', 2);
console.log(result); // return value
```

### Example 2

```javascript
var call = require('function-exec-sync'); // old js calling lts js

var result = call('lts', 'path/to/file.js', 'arg1', 2);
console.log(result); // return value
```

### Documentation

[API Docs](https://kmalakoff.github.io/function-exec-sync/)
