import { NextResponse } from "next/server";
import { executeCode } from "@/lib/executor";
import { getLanguageConfig } from "@/lib/languages";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sourceCode, language, stdin = "" } = body;

    if (!sourceCode || typeof sourceCode !== "string") {
      return NextResponse.json(
        {
          status: "ERROR",
          stdout: "",
          stderr: "Source code cannot be empty.",
          message: "Missing source code in request payload."
        },
        { status: 400 }
      );
    }

    if (!language || typeof language !== "string") {
      return NextResponse.json(
        {
          status: "ERROR",
          stdout: "",
          stderr: "Programming language must be specified.",
          message: "Missing language key."
        },
        { status: 400 }
      );
    }

    const langConfig = getLanguageConfig(language);
    if (!langConfig || !langConfig.supported) {
      return NextResponse.json(
        {
          status: "ERROR",
          stdout: "",
          stderr: `Language '${language}' is not supported by the execution service.`,
          message: "Unsupported language."
        },
        { status: 400 }
      );
    }

    const result = await executeCode(sourceCode, language, String(stdin));
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Execution route error:", error);
    return NextResponse.json(
      {
        status: "ERROR",
        stdout: "",
        stderr: (error as Error)?.message || "Internal server error during code execution.",
        message: "An unexpected error occurred."
      },
      { status: 500 }
    );
  }
}
