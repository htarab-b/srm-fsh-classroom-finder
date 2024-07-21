import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const AnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(URL, AnonKey)