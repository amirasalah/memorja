import { 
  getTokens, 
  getTokenById, 
  createToken, 
  updateToken, 
  softDeleteToken,
  getRelationships,
  createRelationship,
  updateRelationship,
  deleteRelationship,
  closePool
} from '@memorja/database';

// Re-export database functions
export {
  getTokens,
  getTokenById,
  createToken,
  updateToken,
  softDeleteToken,
  getRelationships,
  createRelationship,
  updateRelationship,
  deleteRelationship,
  closePool
};

// Add shutdown handler
process.on('SIGINT', async () => {
  console.log('Closing database connections...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing database connections...');
  await closePool();
  process.exit(0);
});
