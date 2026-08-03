// This file is protected and cannot be modified.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 
  process.env.NEXT_PUBLIC_DATABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  "https://placeholder.supabase.co";

const supabaseKey = 
  process.env.NEXT_PUBLIC_DATABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  "placeholder-key";

export const supabase = createClient(
  supabaseUrl.trim(),
  supabaseKey.trim(),
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
