// src/utils/supabaseClient.js
// Klien Supabase ini digunakan HANYA untuk operasi database dan storage.
// Autentikasi kini ditangani oleh NextAuth.js.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
