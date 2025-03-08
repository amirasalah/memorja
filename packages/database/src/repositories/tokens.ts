import { query } from '../neon';

export interface Token {
  id: string;
  user_id: string;
  content: string;
  content_vector?: number[];
  source_url?: string;
  source_title?: string;
  created_at: string;
  updated_at: string;
  encryption_metadata?: Record<string, any>;
  is_deleted: boolean;
  is_archived: boolean;
  metadata?: Record<string, any>;
}

export async function getTokens(userId: string) {
  return await query(
    'SELECT * FROM tokens WHERE user_id =  AND is_deleted = false ORDER BY created_at DESC',
    [userId]
  );
}

export async function getTokenById(id: string, userId: string) {
  return await query(
    'SELECT * FROM tokens WHERE id =  AND user_id =  AND is_deleted = false',
    [id, userId]
  );
}

export async function createToken(token: Omit<Token, 'id' | 'created_at' | 'updated_at'>) {
  const { user_id, content, source_url, source_title, encryption_metadata, metadata } = token;
  
  return await query(
    `INSERT INTO tokens 
      (user_id, content, source_url, source_title, encryption_metadata, metadata) 
     VALUES (, , , , , ) 
     RETURNING *`,
    [user_id, content, source_url, source_title, encryption_metadata, metadata]
  );
}

export async function updateToken(
  id: string, 
  userId: string, 
  updates: Partial<Omit<Token, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  // Build the update query dynamically based on the fields provided
  const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
  if (fields.length === 0) {
    return { data: null, error: new Error('No fields to update') };
  }
  
  const setExpressions = fields.map((field, index) => `${field} = $${index + 3}`);
  const values = fields.map(field => updates[field as keyof typeof updates]);
  
  const queryText = `
    UPDATE tokens 
    SET ${setExpressions.join(', ')}, updated_at = NOW() 
    WHERE id =  AND user_id =  
    RETURNING *
  `;
  
  return await query(queryText, [id, userId, ...values]);
}

export async function softDeleteToken(id: string, userId: string) {
  return await query(
    'UPDATE tokens SET is_deleted = true, updated_at = NOW() WHERE id =  AND user_id =  RETURNING *',
    [id, userId]
  );
}
