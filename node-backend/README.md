# Node Backend

Minimal Express API with strict TypeScript and ES modules. Requires Node.js 24.11 or later in the Node 24 LTS line, plus npm.

## Setup

From the workspace root:

```sh
cd node-backend
npm ci
npm run dev
```

The API runs at http://localhost:3000. `GET /health` returns HTTP 200 with `{"status":"ok"}`. Unknown routes return a JSON 404 response. Unexpected errors return a generic JSON 500 response, with diagnostic details logged on the server only.

## Commands

| Command             | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Run with automatic restart using tsx      |
| `npm test`          | Run Node test-runner tests with Supertest |
| `npm run typecheck` | Check application and test types          |
| `npm run build`     | Compile application code into dist/       |
| `npm start`         | Run the compiled server after a build     |

Production execution:

```sh
npm run build
npm start
```

## Configuration

`PORT` is optional and defaults to `3000`. It must contain only decimal digits and represent an integer from `1` to `65535`; invalid values stop startup with a nonzero exit code. Choose another port if the default is occupied:

```sh
PORT=3001 npm run dev
```

Environment variables are read from the process environment. No .env file is loaded automatically. This project is independent of the existing frontend; no proxy or CORS policy is configured.

## Structure

- `src/app.ts`: Express application, health route, and JSON error handling.
- `src/config.ts`: Port parsing and validation.
- `src/server.ts`: Server startup.
- `test/app.test.ts`: HTTP behavior and configuration tests.
