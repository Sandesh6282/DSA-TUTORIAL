import { NextResponse } from "next/server";
import {
  checkRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  createSessionToken,
  getExpectedPassword,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${rateCheck.retryAfterSec} seconds before trying again.`
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      recordFailedLogin(ip);
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const expected = getExpectedPassword();

    if (password !== expected) {
      recordFailedLogin(ip);
      const remainingAttempts = checkRateLimit(ip).remaining;
      return NextResponse.json(
        {
          error: `Invalid recruiter access password. ${remainingAttempts} attempt(s) remaining.`
        },
        { status: 401 }
      );
    }

    // Success: reset rate limit and issue token
    resetLoginAttempts(ip);
    const token = createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Recruiter authentication successful."
    });

    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/"
    });

    return response;
  } catch (error: unknown) {
    console.error("Recruiter login error:", error);
    return NextResponse.json({ error: "Authentication service error." }, { status: 500 });
  }
}
