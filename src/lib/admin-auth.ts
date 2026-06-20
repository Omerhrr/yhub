import { NextRequest, NextResponse } from "next/server";

/**
 * Validate an inbound admin API request.
 * The client must send:  Authorization: Bearer <ADMIN_SECRET>
 * where ADMIN_SECRET is set in .env.local.
 *
 * Falls back to a dev-only hardcoded secret if the env var is not set
 * (so the app works out-of-the-box in dev without any config).
 */
export function requireAdminAuth(req: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET ?? "dev-admin-secret";
  const auth   = req.headers.get("authorization") ?? "";
  const token  = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token || token !== secret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  return null; // OK
}

/**
 * Verify admin login credentials.
 * Returns true if the provided email + password match the env vars.
 */
export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail    = process.env.ADMIN_EMAIL    ?? "admin@yahyahub.ng";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  return email === adminEmail && password === adminPassword;
}
