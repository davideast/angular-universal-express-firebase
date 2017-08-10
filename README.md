<div align="center">
<h1 align="center">Angular Universal Express Firebase</h1>
<p align="center">
A packaged Cloud Function to serve Angular Universal apps.
</p>
</div>

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
