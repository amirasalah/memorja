-- Extension for vector operations (for semantic search)
CREATE EXTENSION IF NOT EXISTS vector;

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  is_onboarded BOOLEAN DEFAULT FALSE
);

-- Tokens Table (for storing conversation data)
CREATE TABLE IF NOT EXISTS public.tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  content_vector VECTOR(1536), -- For semantic search capabilities
  source_url TEXT,
  source_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  encryption_metadata JSONB, -- Store encryption-related metadata
  is_deleted BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  metadata JSONB -- Additional metadata about the token
);

-- Create indexes for faster lookup
CREATE INDEX idx_tokens_user_id ON public.tokens(user_id);
CREATE INDEX idx_tokens_created_at ON public.tokens(created_at);
-- Create index for text search
CREATE INDEX idx_tokens_content_tsvector ON public.tokens USING gin(to_tsvector('english', content));
-- Create vector index when using pgvector extension
CREATE INDEX IF NOT EXISTS idx_tokens_vector ON public.tokens USING ivfflat (content_vector vector_cosine_ops) WITH (lists = 100);

-- Relationships Table (to store connections between tokens)
CREATE TABLE IF NOT EXISTS public.relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_token_id UUID NOT NULL REFERENCES public.tokens(id),
  target_token_id UUID NOT NULL REFERENCES public.tokens(id),
  relationship_type TEXT NOT NULL, -- e.g., 'reply', 'related', 'contradiction', etc.
  relationship_strength FLOAT DEFAULT 1.0, -- Numeric value representing strength of the relationship
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB -- Additional metadata about the relationship
);

-- Create indexes for relationships table
CREATE INDEX idx_relationships_user_id ON public.relationships(user_id);
CREATE INDEX idx_relationships_source_token_id ON public.relationships(source_token_id);
CREATE INDEX idx_relationships_target_token_id ON public.relationships(target_token_id);
CREATE INDEX idx_relationships_type ON public.relationships(relationship_type);
