# Angular Universal Express Firebase

## CommonJS
```js
const { angularUniversal } = require('angular-universal-firebase-hosting');
exports.trigger = angularUniversal.trigger({
  index: 'path/to/index.html',
  main: 'path/to/bundle.longhash.js',
  enableProdMode: true
});

```

## TypeScript
```ts
import { angularUniversal } from 'angular-universal-firebase-hosting';
export let trigger = angularUniversal.trigger({
  index: 'path/to/index.html',
  main: 'path/to/bundle.longhash.js',
  enableProdMode: true
});
```
