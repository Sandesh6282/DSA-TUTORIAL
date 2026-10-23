import crypto from "crypto";

const SESSION_COOKIE_NAME = "recruiter_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

// In-memory rate limiting map: ip -> { attempts, firstAttemptTime }
const loginAttempts = new Map<string, { attempts: number; firstAttemptTime: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function getSecretKey(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.RECRUITER_ACCESS_PASSWORD ||
    "dsa_tutor_recruiter_secret_key_2026_default_salt"
  );
}

export function getExpectedPassword(): string {
  return process.env.RECRUITER_ACCESS_PASSWORD || "Recruiter2026!";
}

/**
 * Creates an HMAC-signed session token containing expiry timestamp
 */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = JSON.stringify({ role: "recruiter", exp: expiresAt });
  const base64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(base64Payload)
    .digest("base64url");
  return `${base64Payload}.${signature}`;
}

/**
 * Validates session token signature and expiration
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [base64Payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", getSecretKey())
    .update(base64Payload)
    .digest("base64url");

  // Constant-time comparison
  try {
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isSignatureValid) return false;

    const payload = JSON.parse(Buffer.from(base64Payload, "base64url").toString("utf8"));
    if (payload.role !== "recruiter") return false;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Rate limiting check for login attempts by IP
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS };
  }

  if (now - entry.firstAttemptTime > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS };
  }

  if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
    const retryAfterSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - entry.firstAttemptTime)) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - entry.attempts };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now - entry.firstAttemptTime > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(ip, { attempts: 1, firstAttemptTime: now });
  } else {
    entry.attempts++;
  }
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
