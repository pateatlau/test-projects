import { app } from './app.js';
import { parsePort } from './config.js';

try {
  const port = parsePort(process.env.PORT);
  const server = app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });

  server.on('error', (error) => {
    console.error('Failed to start API', error);
    process.exitCode = 1;
  });
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : 'Failed to start API');
  process.exitCode = 1;
}
