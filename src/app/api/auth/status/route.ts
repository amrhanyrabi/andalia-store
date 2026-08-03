import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const adminCount = await db.collection("admin_users").countDocuments();
    const hasAdmin = adminCount > 0;

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    let isAuthenticated = false;
    let userEmail = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        isAuthenticated = true;
        userEmail = decoded.email;
      } catch {
        // invalid token
      }
    }

    return NextResponse.json({
      hasAdmin,
      isAuthenticated,
      isAdmin: isAuthenticated, // for now, if authenticated via admin_token, you are admin
      user: userEmail ? { email: userEmail } : null
    });
  } catch (error) {
    return NextResponse.json({ hasAdmin: false, isAuthenticated: false }, { status: 500 });
  }
}
