import Fastify from 'fastify';
import FastifyTraps from '@dnlup/fastify-traps';
import FastifyStatic from 'fastify-static';
import Minimatch from 'minimatch';
import FS from 'fs';
import FSp from 'fs/promises';
import Path from 'path';

import { logger } from './logger.js';
import { blobPath, unauthenticatedPaths } from './config.js';
import { validateJwt } from './jwt.js';

const fastifyLogger = logger.child({ name: 'blob.fastify' });
export const server = Fastify({
  logger: fastifyLogger,
});

server.register(FastifyTraps);
server.register(FastifyStatic, {
  root: blobPath,
  acceptRanges: true,
  dotfiles: 'ignore',
  index: false,
  wildcard: false,
  redirect: false,
  serve: false,
  preCompressed: true,
});

server.setNotFoundHandler((req, reply) => {
  reply.send({
    reqId: req.id,
    error: "Path not found.",
  });
})

server.addHook('onError', (req, rep, err) => {
  req.log.error({ err }, "An error occurred.");
  rep.send({
    reqId: req.id,
    error: 'Something bad happened! Feel free to reach out with your request ID.',
  });
});

server.get<{
  Querystring: { q?: string }
}>('/*', {}, async (req, rep) => {
  let pathMatchers: ReadonlyArray<string> = unauthenticatedPaths;

  const resolvedUrl = Path.resolve(req.url);

  const validation = req.query?.q ? validateJwt(req.query?.q, req.log) : null;
  if (validation === 'invalid') {
    rep.status(401).send({ error: 'Token invalid or expired. Please refresh your client.' });
    return;
  }

  if (validation !== null) {
    pathMatchers = validation.computedPaths;
  }

  const isValidRequest = pathMatchers.some(p => Minimatch(resolvedUrl, p));
  if (!isValidRequest) {
    rep.status(403).send({ error: 'Access denied.' });
    return;
  }

  const file = Path.join(blobPath, resolvedUrl);
  req.log.info({ file }, "File requested.");
  if (!FS.existsSync(file) || !(await FSp.stat(file)).isFile()) {
    rep.status(404).send({ error: 'File not found.' });
    return;
  }

  return rep.sendFile(resolvedUrl);
});
