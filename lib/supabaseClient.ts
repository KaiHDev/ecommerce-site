// Importing the Supabase client from the library
import { createClient } from '@supabase/supabase-js';

// Accessing environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initializing the Supabase client with the project URL and anonymous key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
