import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/integrations/supabase/server";
export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(
      "id,title_ar,title_en,description_ar,description_en,price,image_url,affiliate_link,category_ar,category_en,created_at,updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  return NextResponse.json({ products: data ?? [] });
}
