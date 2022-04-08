import { address, port } from './config.js';
import { server } from './server.js';

const runServer = async () => {
  try {
    await server.listen(port, address);
    server.log.info({ listen: server.server.address() }, `Fastify is listening.`);
  } catch (err) {
    server.log.error({ err }, "Fastify encountered an error and is bailing.");
    process.exit(1);
  }
}
runServer();
