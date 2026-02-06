import { createClient } from '@supabase/supabase-js';

// TODO: Replace with environment variables or ensure they are set in .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables! Check .env file.");
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
