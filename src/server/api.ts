import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { appRouter } from './trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// Create Hono app
const app = new Hono();

// Add CORS middleware
app.use('/*', cors());

// Basic health check endpoint
app.get('/health', (c) => c.json({ status: 'ok' }));

// Handle tRPC requests
app.all('/trpc/*', async (c) => {
  const requestUrl = new URL(c.req.url);
  const res = await fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}),
  });
  
  return res;
});

export default app;