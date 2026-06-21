import { NextRequest, NextResponse } from "next/server";

// ── In-memory rate limiter ────────────────────────────────────────────────────
// Keyed by IP → { count, resetAt (ms epoch) }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX       = 20;     // max requests per window per IP

// Routes to rate-limit (prefix match)
const RATE_LIMITED_PREFIXES = [
  "/api/admin/auth",
  "/api/workspaces/",  // catches /api/workspaces/[id]/book
  "/api/programs/",    // catches /api/programs/[id]/enroll
  "/api/events/",      // catches /api/events/[id]/register
];

function isRateLimited(prefix: string, pathname: string) {
  return RATE_LIMITED_PREFIXES.some(p => p === prefix || pathname.startsWith(p));
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false; // not limited
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true; // limited
  return false;
}

// Periodically clean up expired entries to avoid memory leaks
// (runs inside the middleware closure on each call — cheap because it's O(1) per check)
let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60_000) return; // clean every 5 min
  lastCleanup = now;
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}

// ── Security headers ──────────────────────────────────────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options":           "DENY",
  "X-Content-Type-Options":    "nosniff",
  "Referrer-Policy":           "strict-origin-when-cross-origin",
  "Permissions-Policy":        "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control":    "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  // Lightweight CSP — allows Paystack inline, same-origin scripts, and fonts/images from anywhere
  "Content-Security-Policy": [
    "default-src 'self'",
    // React dev mode requires eval(); strip it in production
    `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV !== "production" ? "'unsafe-eval' " : ""}https://js.paystack.co`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https://api.paystack.co https://js.paystack.co",
    "frame-src https://js.paystack.co https://checkout.paystack.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; "),
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  maybeCleanup();

  // ── Rate limit sensitive API endpoints (POST/PUT only) ────────────────────
  if (
    req.method !== "GET" &&
    req.method !== "HEAD" &&
    RATE_LIMITED_PREFIXES.some(p => pathname.startsWith(p))
  ) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute and try again." },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }
  }

  // ── Apply security headers to every response ──────────────────────────────
  const res = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

export const config = {
  // Run on all routes except static assets and Next internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot)$).*)",
  ],
};
