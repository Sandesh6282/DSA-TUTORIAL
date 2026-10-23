import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getRecruiterTopics, saveRecruiterTopics } from "@/lib/recruiterStore";

export async function GET() {
  const topics = getRecruiterTopics();
  return NextResponse.json({ topics });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json(
      { error: "Unauthorized: Recruiter authentication required to modify curriculum settings." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { topics } = body;

    const result = saveRecruiterTopics(topics);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Curriculum configuration saved successfully.",
      topics: getRecruiterTopics()
    });
  } catch (error: unknown) {
    console.error("Config save error:", error);
    return NextResponse.json({ error: "Failed to save configuration." }, { status: 500 });
  }
}
