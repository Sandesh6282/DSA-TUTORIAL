import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { question, topic } = await req.json();

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "ENTER_YOUR_API_KEY_HERE") {
      return NextResponse.json({
        reply:
          "⚠️ Gemini API key is not configured. Please add `GEMINI_API_KEY` to your `.env.local` file or in your Vercel project environment variables to enable the AI Tutor.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `Briefly answer the following question related to ${
      topic || "Data Structures and Algorithms"
    }. Format the response properly with code blocks or explanations as needed: "${question.trim()}"`;

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-2.5-pro"];
    let responseText = "";
    let lastError: unknown = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!responseText && lastError) {
      throw lastError;
    }

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      {
        reply:
          "Sorry, there was an issue communicating with the AI service. Please verify your GEMINI_API_KEY and try again.",
      },
      { status: 500 }
    );
  }
}
