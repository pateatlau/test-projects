import express from 'express';
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  console.error('Unexpected request error', error);
  response.status(500).json({ error: { message: 'Internal server error' } });
};

export const app = express();

app.disable('x-powered-by');

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use((_request, response) => {
  response.status(404).json({ error: { message: 'Not found' } });
});

app.use(errorHandler);
