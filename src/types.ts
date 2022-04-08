import RT from 'runtypes';
import Luxon from 'luxon';

export const JWTPayload = RT.Record({
  sub: RT.String,
  exp: RT.Number,
  paths: RT.Array(RT.String),
});
export type JWTPayload = RT.Static<typeof JWTPayload>;
export type CacheItem = {
  jwt: JWTPayload,
  expiresAt: Luxon.DateTime,
  computedPaths: Array<string>,
}
