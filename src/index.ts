import * as functions from 'firebase-functions';
import * as express from 'express';
import { angularUniversal, ServerConfiguration } from 'angular-universal-express';

export type Trigger = functions.TriggerAnnotated & ((req: Express.Request, resp: Express.Response) => void);

export interface FirebaseConfiguration extends ServerConfiguration {
  staticDirectory?: string;
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
  if(config.staticDirectory) {
    router.use(express.static(config.staticDirectory));
  }
  router.get('/*', angularUniversal(config));
  return router;
}
