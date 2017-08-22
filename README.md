<div align="center">
  <h1 align="center">Angular Universal Express Firebase</h1>
  <p align="center">
    A packaged Cloud Function to serve Angular Universal apps.
  </p>
</div>

## Install

```bash
npm i angular-universal-express-firebase
```
NB: Run this command _afer_ initialzing functions and from within the `functions` folder

## Basic Usage
```js
const angularUniversal = require('angular-universal-express-firebase');
exports.trigger = angularUniversal.trigger({
  index: 'path/to/index.html',
  main: 'path/to/bundle.longhash',
  enableProdMode: true,
  cdnCacheExpiry: 600,
  browserCacheExpiry: 300,
  staleWhileRevalidate: 120
});
```

## TypeScript usage
```ts
import * as angularUniversal from 'angular-universal-express-firebase';
export let trigger = angularUniversal.trigger({
  index: 'path/to/index.html',
  main: 'path/to/bundle.longhash',
  enableProdMode: true,
  cdnCacheExpiry: 600,
  browserCacheExpiry: 300,
  staleWhileRevalidate: 120  
});
```

## Setup
There are two parts to an Angular Universal app: the **server build** and the **server**.

### Server Build
The current RC version of the Angular CLI covers the server build. [Follow these steps to setup the CLI to get a server build.](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/universal-rendering.md)

### Cloud Functions as the server

#### Build both browser and server Angular builds
You may want to use the `--output-hashing none` flag with your universal build to avoid needing to change the hash
with each build in your function.js. At this point you should have two app entries in your `angularcli.json`
file: **browser** and **server**. The browser build writes to the `dist` folder and the server build writes to the
`dist-server` folder. 

#### Delete `dist/index.html`. 
This index file is uneeded because Angular Universal uses the assets in `dist-server` to generate the initial HTML.

#### Install the Firebase CLI.

```bash
# npm
npm i firebase-tools -g
# yarn
yarn add firebase-tools --global
```

#### Initialize Firebase Hosting and Cloud Functions.

```bash
firebase init hosting
# specify the public directory to dist
firebase init functions
# this will create a functions folder 
# with and index.js, package.json, and set
# of node_modules
```

#### Open `functions/index.js` and add the following code.

```js
const angularUniversal = require('angular-universal-express-firebase');
exports.trigger = angularUniversal.trigger({
  index: __dirname + 'dist-server/index.html',
  // make sure this points at the correct hash, or use the --output-hashing none flag on your ng build.
  main: __dirname + '/bundle.<generated-hash>',
  enableProdMode: true,
  cdnCacheExpiry: 600, // cache in the CDN for 10 minutes
  browserCacheExpiry: 300, // cache in the browser for 5 minutes
  staleWhileRevalidate: 120 // serve a stale version for 2 minutes after cdnCacheExpiry, but refresh CDN in background
});
```

#### Setup the rewrite in `firebase.json`

Firebase Hosting needs to know which Cloud Function to call.

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "function": "trigger"
      }
    ]
  }
}
```

#### Serve locally to test

The Firebase CLI allows you to serve locally and emulate the production environment.

```bash
firebase serve --only functions,hosting
# visit locahost:5000
```

#### Deploy

Now that it looks great locally, deploy to production.

```bash
firebase deploy
firebase open hosting:site 
# automatically opens default browser to the prod site
```
