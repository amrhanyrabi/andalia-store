// This file is protected and cannot be modified.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 
  process.env.DATABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_DATABASE_URL || 
  "https://placeholder.supabase.co";

const supabaseServiceKey = 
  process.env.DATABASE_SERVICE_ROLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_DATABASE_PUBLISHABLE_KEY || 
  "placeholder-key";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
