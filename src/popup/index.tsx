import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/trpc';
import Popup from './Popup';
import '../styles/globals.css';

// Create tRPC client
export const trpc = createTRPCReact<AppRouter>();

// Create a QueryClient for React Query
const queryClient = new QueryClient();

// Create a custom fetch function that uses chrome.runtime.sendMessage
const customFetch = (url: string, options: RequestInit) => {
  const [, procedure] = url.split('/trpc/');
  const [path, queryString] = procedure.split('?');
  
  const input = queryString
    ? JSON.parse(decodeURIComponent(queryString.split('=')[1]))
    : undefined;
  
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: 'TRPC_REQUEST',
        payload: {
          path,
          input,
        },
      },
      (response) => {
        resolve(new Response(JSON.stringify(response.data), {
          status: response.success ? 200 : 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }));
      }
    );
  });
};

// Configure tRPC client
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/trpc',
      fetch: customFetch as unknown as typeof fetch,
    }),
  ],
});

// Render the app
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Popup />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);