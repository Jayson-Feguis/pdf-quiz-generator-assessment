import { NextRequest } from "next/server";
import { generateQuizFromPdf } from "@/lib/utils/generate-quiz-from-pdf";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey)
      throw new Error(
        "Missing OpenAI API key. Please set OPENAI_API_KEY in your .env.local."
      );

    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    const quiz = await generateQuizFromPdf(file);

    return Response.json(quiz);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
