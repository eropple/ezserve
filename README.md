# `@eropple/ezserve` #
This HTTP server is a file server that accepts a query string JWT to enable access to
private content.

**This is an extremely alpha project.** If you want to use it, you should spend a little
time reading it. I'm not offering any help for this one, just some quick notes:

## Quickest of Start ##
```
$ EZSERVE_FILE_STORE_PATH=$(realpath ./tmp/) EZSERVE_JWT_KEY=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa yarn dev
```

## Configuration ##
- The config is included literally below. If there isn't a default (a second argument to `GetEnv`), it's required!
- URLs generated with JWTs should follow the `JWTPayload` below, and the JWT should be passed as the `q` query string parameter.
- Requests that do not have a JWT passed as `q` can access `unauthenticatedPaths`, which defaults to "anything under the `/p` path".
- Signed requests _can_ access `unauthenticatedPaths`.

```ts
// calls to `GetEnv` *without* a second argument mean
// that the environemnt variable is REQUIRED.

// `envKeyPrefix` defaults to `EZSERVE`, so the below are `EZSERVE_JWT_KEY`, etc.
export const envKeyPrefix = GetEnv.string("EZSERVE_ENV_KEY_PREFIX", "EZSERVE");

// REQUIRED: the JWT HS384 key
export const jwtKey = GetEnv.string(`${envKeyPrefix}_JWT_KEY`);

// REQUIRED: the path on the file system (defaults to /srv/ezserve in Docker)
export const blobPath = Path.resolve(GetEnv.string(`${envKeyPrefix}_FILE_STORE_PATH`));

export const unauthenticatedPaths: ReadonlyArray<string> =
  GetEnv.string(`${envKeyPrefix}_UNAUTHENTICATED_PATHS`, '/p/**/*').split(':');
export const address = GetEnv.string(`${envKeyPrefix}_HTTP_ADDRESS`, '0.0.0.0');
export const port = GetEnv.int(`${envKeyPrefix}_HTTP_PORT`, 13305);
export const cacheSize = GetEnv.int(`${envKeyPrefix}_CACHE_SIZE`, 1000);
```

```ts
// the JWT payload that you sign with `jwtKey` must include
// the following. `paths` is an array of globstar paths that
// the bearer of this JWT can download.
export const JWTPayload = RT.Record({
  sub: RT.String,
  exp: RT.Number,
  paths: RT.Array(RT.String),
});
export type JWTPayload = RT.Static<typeof JWTPayload>;
```
