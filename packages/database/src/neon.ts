import { Pool } from 'pg';

// For direct database operations (server-side only)
let pgPool: Pool | null = null;

// Initialize Neon PG connection (only on server)
export const getPooledConnection = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Database connection should only be initialized server-side');
  }
  
  if (!pgPool) {
    const connectionString = process.env.NEON_DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing NEON_DATABASE_URL environment variable');
    }
    
    pgPool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Neon serverless connections
      },
    });
  }
  
  return pgPool;
};

// Close pool during shutdown
export const closePool = async () => {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
};

// Helper function for direct database queries
export const query = async (text: string, params: any[] = []) => {
  const pool = getPooledConnection();
  try {
    const result = await pool.query(text, params);
    return { data: result.rows, error: null };
  } catch (error: any) {
    console.error('Database query error:', error.message);
    return { data: null, error };
  }
};
