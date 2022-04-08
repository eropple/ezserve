import { FastifyLoggerInstance } from 'fastify';
import Luxon from 'luxon';
import JWT from 'fast-jwt';

import { cache } from './cache.js';
import { CacheItem, JWTPayload } from './types.js';
import { jwtKey, unauthenticatedPaths } from './config.js';

const jwtVerifier = JWT.createVerifier({
  key: jwtKey,
  algorithms: ['HS384'],
});

export function validateJwt(q: string, log: FastifyLoggerInstance): CacheItem | 'invalid' {
  try {
    let item = cache.get(q);
    const now = Luxon.DateTime.now().toUTC();

    if (!item) {
      const payload = JWTPayload.check(jwtVerifier(q));

      item = {
        jwt: payload,
        expiresAt: Luxon.DateTime.fromSeconds(payload.exp).toUTC(),
        computedPaths: [ ...unauthenticatedPaths, ...payload.paths ],
      }

      const duration = item.expiresAt.diff(now);
      const maxAge = Math.max(1, duration.toMillis() - 500);

      cache.set(q, item, { maxAge })
    }

    if (item.expiresAt <= now) {
      throw new Error(`expired JWT for sub ${item.jwt.sub}.`);
    }

    return item;
  } catch (err) {
    log.error({ err }, "Error in validateJwt.");
    cache.delete(q);
    return 'invalid';
  }
}
