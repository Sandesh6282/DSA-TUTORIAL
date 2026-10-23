import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { resetRecruiterTopicsToDefault } from "@/lib/recruiterStore";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json(
      { error: "Unauthorized: Recruiter authentication required." },
      { status: 401 }
    );
  }

  const topics = resetRecruiterTopicsToDefault();
  return NextResponse.json({
    success: true,
    message: "Curriculum reset to default settings.",
    topics
  });
}
