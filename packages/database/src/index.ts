import { createClient, SupabaseClient } from '@supabase/supabase-js';
export * from './neon';

// Initialize database client
let supabaseUrl = '';
let supabaseAnonKey = '';

// Set in browser environments
if (typeof window !== 'undefined') {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
} 
// Set in Node.js environments
else if (typeof process !== 'undefined') {
  supabaseUrl = process.env.SUPABASE_URL || '';
  supabaseAnonKey = process.env.SUPABASE_SERVICE_KEY || '';
}

// Create the Supabase client (primarily for auth)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication types
export interface SignUpCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

// Basic authentication functions using Supabase
export const signUpWithEmail = async ({ email, password, fullName }: SignUpCredentials) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    return { data: null, error };
  }
};

export const signInWithEmail = async ({ email, password }: SignInCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error('Error signing out:', error.message);
    return { error };
  }
};

// Export repositories
export * from './repositories/tokens';
export * from './repositories/relationships';
