import Pino from 'pino';

import * as config from './config.js';

export const logger = Pino({
  name: 'blob',
});

logger.info({
  address: config.address,
  port: config.port,
  unauthenticatedPaths: config.unauthenticatedPaths,
  blobPath: config.blobPath,
  cacheSize: config.cacheSize,
}, 'Logger started; application starting up.');
