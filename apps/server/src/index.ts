import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { getTokens } from './db';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Example route using Neon database
app.get('/api/tokens', async (req, res) => {
  try {
    // Normally you would get the user ID from the authenticated session
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const { data, error } = await getTokens(userId);
    
    if (error) {
      throw error;
    }
    
    return res.json({ data });
  } catch (error: any) {
    console.error('Error fetching tokens:', error.message);
    return res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
