import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import pdfParse from "pdf-parse-new";
import _ from "lodash";
import { chunkText } from "@/lib/utils/chunk-text";
import { CHUNKS, MAX_FILE_SIZE, QUESTIONS_COUNT } from "@/lib/constants";
import { QuizSchema } from "@/lib/schemas/quiz.schema";

export async function generateQuizFromPdf(file: File) {
  if (!file) throw new Error("No PDF file provided");

  if (file.type !== "application/pdf")
    throw new Error("Invalid file type. Please upload PDF only");

  if (file.size > MAX_FILE_SIZE)
    throw new Error(`File size exceeds the ${MAX_FILE_SIZE}MB limit.`);

  const buffer = Buffer.from(await file.arrayBuffer());
  const pdfData = await pdfParse(buffer);
  const text = pdfData.text?.trim();

  if (!text || text.length < 100)
    throw new Error("PDF has insufficient extractable text");

  if (text.length > CHUNKS.LARGE)
    throw new Error("PDF has insufficient extractable text");

  // Smart chunking based on total text length and desired question count
  const chunks =
    text.length < CHUNKS.LARGE && text.length >= CHUNKS.MEDIUM
      ? chunkText(text, Math.ceil(text.length / QUESTIONS_COUNT))
      : [text];
  const quizzes = [];

  for (const chunk of chunks) {
    const content = `
      Create a ${QUESTIONS_COUNT}-question multiple choice quiz from this text. Include:
      - A descriptive title
      - ${QUESTIONS_COUNT} questions with 4 options in array (no labels like A, B, etc.)
      - Index of correct answer (0-based)
      - Brief explanation for each answer

      Text:
      ${chunk}`.trim();

    const result = await generateObject({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content,
        },
      ],
      schema: QuizSchema,
      temperature: 0.7,
    });
    quizzes.push(result.object);
  }

  // Merge & shuffle all questions
  const allQuestions = quizzes.flatMap((q) => q.questions);
  const mergedQuiz = {
    title: quizzes[0]?.title || "Generated Quiz",
    questions: _.shuffle(allQuestions).slice(0, QUESTIONS_COUNT),
  };

  return {
    ...mergedQuiz,
    metadata: {
      pageCount: pdfData.numpages,
      textLength: text.length,
      chunkCount: chunks.length,
      questionCount: QUESTIONS_COUNT,
    },
  };
}
