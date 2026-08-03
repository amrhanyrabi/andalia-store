import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db();
    
    // Only allow registration if no admin exists
    const adminCount = await db.collection("admin_users").countDocuments();
    if (adminCount > 0) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.collection("admin_users").insertOne({
      email,
      password: hashedPassword,
      created_at: new Date().toISOString()
    });

    const token = jwt.sign({ email, id: result.insertedId }, JWT_SECRET, { expiresIn: "7d" });

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
