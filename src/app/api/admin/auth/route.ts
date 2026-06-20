import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (!verifyAdminCredentials(email, password)) {
      // Uniform delay to prevent timing attacks
      await new Promise(r => setTimeout(r, 400));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const secret = process.env.ADMIN_SECRET ?? "dev-admin-secret";
    return NextResponse.json({ token: secret });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
