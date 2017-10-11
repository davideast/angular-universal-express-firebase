import { Provider } from '@angular/core';
import * as functions from 'firebase-functions';
import * as express from 'express';
import { angularUniversal, ServerConfiguration } from 'angular-universal-express';

export type Trigger = functions.TriggerAnnotated & ((req: Express.Request, resp: Express.Response) => void);

export interface FirebaseConfiguration extends ServerConfiguration {
  staticDirectory?: string;
  cdnCacheExpiry: number;
  browserCacheExpiry: number;
  staleWhileRevalidate?: number;
  extraProviders?: Provider[]
}

/**
 * Create a Cloud Function HTTPS Trigger configured to generate
 * Angular Universal responses.
 * @param config 
 */
export let trigger = (config: FirebaseConfiguration): Trigger => {
  return functions.https.onRequest(createExpressApp(config));
};

/**
 * Create an express app configued to generate Angular Universal
 * responses. Note: a static directory that contains your static
 * Angular assets must be supplied. Otherwise each asset request 
 * will trigger a dynamic response.
 * @param config 
 */
function createExpressApp(config: FirebaseConfiguration) {
  const router = express();
  /** 
   * An express static directory is not usually neccessary when  
   * in use with Firebase Hosting. Hosting will always prefer 
   * existing static assets to dynamic routes. 
   */
  if(valueExists(config.staticDirectory)) {
    router.use(express.static(config.staticDirectory!));
  }

  const cacheControlValue = getCacheControlHeader(config);
  // middleware that applies a Cache-Control header to each dynamic response
  router.use((req, res, next) => {
    res.set('Cache-Control', cacheControlValue);
    next();
  });
  
  router.get('/*', angularUniversal(config));
  return router;
}

function valueExists(value?: any) {
  return !(typeof value === 'undefined' || value === null);
}

/**
 * Checks a given configuration for Cache-Control header values 
 * and either returns the supplied values or the default values (0).
 * @param config 
 */
function checkCacheControlValue(config: FirebaseConfiguration) {
  let cdnCacheExpiry = 0
  let browserCacheExpiry = 0;
  let staleWhileRevalidate = 0;
  if(valueExists(config.cdnCacheExpiry)) {
    cdnCacheExpiry = config.cdnCacheExpiry;
  }
  if(valueExists(config.browserCacheExpiry)) {
    browserCacheExpiry = config.browserCacheExpiry;
  }
  if(valueExists(config.staleWhileRevalidate)) {
    staleWhileRevalidate = config.staleWhileRevalidate!;
  }
  return { cdnCacheExpiry, browserCacheExpiry, staleWhileRevalidate };
}

/**
 * Returns the Cache-Control header value given a config object.
 * @param config 
 */
function getCacheControlHeader(config: FirebaseConfiguration) {
  const { cdnCacheExpiry, browserCacheExpiry, staleWhileRevalidate } = checkCacheControlValue(config);
  return `public, max-age=${browserCacheExpiry}, s-maxage=${cdnCacheExpiry}, stale-while-revalidate=${staleWhileRevalidate}`;
}
