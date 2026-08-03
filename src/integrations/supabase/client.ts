// This file is protected and cannot be modified.
import { createClient } from "@supabase/supabase-js";

// تأكيد قراءة الـ URL والـ Key بشكل مباشر ونظيف
const supabaseUrl = (
  process.env.NEXT_PUBLIC_DATABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  ""
).trim().replace(/\/+$/, ""); // إزالة أي / زائدة في آخر اللينك

const supabaseKey = (
  process.env.NEXT_PUBLIC_DATABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  ""
).trim();

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
