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

## Basic Usage
```js
const { angularUniversal } = require('angular-universal-firebase-hosting');
exports.trigger = angularUniversal.trigger({
  index: 'path/to/index.html',
  main: 'path/to/bundle.longhash.js',
  enableProdMode: true,
  cdnCacheExpiry: 600,
  browserCacheExpiry: 300
});
```

## TypeScript usage
```ts
import { angularUniversal } from 'angular-universal-firebase-hosting';
export let trigger = angularUniversal.trigger({
  index: 'path/to/index.html',
  main: 'path/to/bundle.longhash.js',
  enableProdMode: true,
  cdnCacheExpiry: 600,
  browserCacheExpiry: 300  
});
```

## Setup
There are two parts to an Angular Universal app: the **server build** and the **server**.

### Server Build
The current RC version of the Angular CLI covers the server build. [Follow these steps to setup the CLI to get a server build.](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/universal-rendering.md)

### Cloud Functions as the server

#### Build both browser and server Angular builds
At this point you should have two app entries in your `angularcli.json` file: **browser** and **server**. The browser
build writes to the `dist` folder and the server build writes to the `dist-server` folder. 

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
const { angularUniversal } = require('angular-universal-firebase-hosting');
exports.trigger = angularUniversal.trigger({
  index: __dirname + 'dist-server/index.html',
  main: __dirname + '/bundle.<generated-hash>.js', // make sure this points at the correct hash
  enableProdMode: true,
  cdnCacheExpiry: 600, // cache in the CDN for 10 minutes
  browserCacheExpiry: 300 // cache in the browser for 5 minutes
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


