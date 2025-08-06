import { NextRequest } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import pdfParse from "pdf-parse-new";

const QuizSchema = z.object({
  title: z.string(),
  questions: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()).length(4),
        correctAnswer: z.number().min(0).max(3),
        explanation: z.string(),
      })
    )
    .length(5),
});

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey)
      throw Error(
        "Missing OpenAI API key. Please set OPENAI_API_KEY in your .env.local."
      );

    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) throw Error("No PDF file provided");
    if (file.type !== "application/pdf") throw Error("Invalid file type");

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("BUFFER =>", buffer);
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text?.trim();

    if (!text || text.length < 100)
      throw Error("PDF has insufficient extractable text");

    const maxTextLength = 15_000;
    const content =
      text.length > maxTextLength
        ? text.slice(0, maxTextLength) + "\n\n[Truncated]"
        : text;

    const result = await generateObject({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: `
          Create a 5-question multiple choice quiz from this text. Include:
          - A descriptive title
          - 5 questions with 4 options in array (do not label it like A,B,C,D or any label before the option)
          - Index of correct answer (0-based)
          - Brief explanation for each answer

          Text:
          ${content}
          `,
        },
      ],
      schema: QuizSchema,
      temperature: 0.7,
    });

    return Response.json({
      ...result.object,
      metadata: {
        pageCount: pdfData.numpages,
        textLength: text.length,
        truncated: text.length > maxTextLength,
      },
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
