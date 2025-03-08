import { query } from '../neon';

export interface Relationship {
  id: string;
  user_id: string;
  source_token_id: string;
  target_token_id: string;
  relationship_type: string;
  relationship_strength?: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export async function getRelationships(userId: string, tokenId?: string) {
  if (tokenId) {
    return await query(
      `SELECT r.*, 
        source.content as source_content, target.content as target_content 
       FROM relationships r
       JOIN tokens source ON r.source_token_id = source.id
       JOIN tokens target ON r.target_token_id = target.id
       WHERE r.user_id =  AND (r.source_token_id =  OR r.target_token_id = )`,
      [userId, tokenId]
    );
  }
  
  return await query(
    `SELECT r.*, 
      source.content as source_content, target.content as target_content 
     FROM relationships r
     JOIN tokens source ON r.source_token_id = source.id
     JOIN tokens target ON r.target_token_id = target.id
     WHERE r.user_id = `,
    [userId]
  );
}

export async function createRelationship(relationship: Omit<Relationship, 'id' | 'created_at' | 'updated_at'>) {
  const { 
    user_id, 
    source_token_id, 
    target_token_id, 
    relationship_type, 
    relationship_strength = 1.0, 
    metadata 
  } = relationship;
  
  return await query(
    `INSERT INTO relationships 
      (user_id, source_token_id, target_token_id, relationship_type, relationship_strength, metadata) 
     VALUES (, , , , , ) 
     RETURNING *`,
    [user_id, source_token_id, target_token_id, relationship_type, relationship_strength, metadata]
  );
}

export async function updateRelationship(
  id: string, 
  userId: string, 
  updates: Partial<Omit<Relationship, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  // Build the update query dynamically based on the fields provided
  const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
  if (fields.length === 0) {
    return { data: null, error: new Error('No fields to update') };
  }
  
  const setExpressions = fields.map((field, index) => `${field} = $${index + 3}`);
  const values = fields.map(field => updates[field as keyof typeof updates]);
  
  const queryText = `
    UPDATE relationships 
    SET ${setExpressions.join(', ')}, updated_at = NOW() 
    WHERE id =  AND user_id =  
    RETURNING *
  `;
  
  return await query(queryText, [id, userId, ...values]);
}

export async function deleteRelationship(id: string, userId: string) {
  return await query(
    'DELETE FROM relationships WHERE id =  AND user_id =  RETURNING id',
    [id, userId]
  );
}
