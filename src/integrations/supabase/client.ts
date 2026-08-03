// This file is protected and cannot be modified.
import { createClient } from "@supabase/supabase-js";

// تحديد الـ URL الحقيقي للـ Supabase
const rawUrl = process.env.NEXT_PUBLIC_DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";

// في المتصفح نستخدم الـ Proxy للهروب من حجب الـ DNS، وفي السيرفر نستخدم الـ URL المباشر
const supabaseUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/supabase-proxy`
  : (rawUrl || "https://placeholder.supabase.co");

const supabaseKey = 
  process.env.NEXT_PUBLIC_DATABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  "placeholder-key";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
