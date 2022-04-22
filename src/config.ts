import Path from 'path';
import FS from 'fs';
import GetEnv from 'getenv';

export const envKeyPrefix = GetEnv.string("EZSERVE_ENV_KEY_PREFIX", "EZSERVE");

// REQUIRED: the JWT HS384 key
export const jwtKey = GetEnv.string(`${envKeyPrefix}_JWT_KEY`);

// REQUIRED: the path on the file system (defaults to /srv/blob-server in Docker)
export const blobPath = Path.resolve(GetEnv.string(`${envKeyPrefix}_FILE_STORE_PATH`));

export const unauthenticatedPaths: ReadonlyArray<string> =
  GetEnv.string(`${envKeyPrefix}_UNAUTHENTICATED_PATHS`, '/p/**/*').split(':');
export const address = GetEnv.string(`${envKeyPrefix}_HTTP_ADDRESS`, '0.0.0.0');
export const port = GetEnv.int(`${envKeyPrefix}_HTTP_PORT`, 13005);
export const cacheSize = GetEnv.int(`${envKeyPrefix}_CACHE_SIZE`, 1000);
export const shouldPrecompress = GetEnv.boolish(`${envKeyPrefix}_PRECOMPRESS`, false);

if (!FS.statSync(blobPath).isDirectory) {
  throw new Error(`blob path '${blobPath}' is not set or cannot be found.`);
}
