import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Create a tRPC instance
const t = initTRPC.create();

// Export tRPC helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Create a simple router
export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'World'}!`,
      };
    }),
  
  getCount: publicProcedure.query(async () => {
    // In a real app, this would fetch from storage or a database
    return { count: 42 };
  }),
  
  incrementCount: publicProcedure
    .input(z.object({
      amount: z.number().default(1),
    }))
    .mutation(async ({ input }) => {
      // In a real app, this would update storage or a database
      return { success: true, incrementedBy: input.amount };
    }),
});

// Export type of the router
export type AppRouter = typeof appRouter;