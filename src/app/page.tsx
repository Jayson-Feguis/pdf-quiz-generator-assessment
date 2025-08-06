"use client";
import { Quiz } from "@/features/quiz";
import { UploadPDF } from "@/features/upload-pdf";
import { useQuiz } from "@/hooks/use-quiz";
import { useState } from "react";

export default function Home() {
  const { quiz, onQuizComplete, resetQuiz, generateQuiz, loading } = useQuiz();
  const [file, setFile] = useState<File | null>(null);

  return quiz ? (
    <Quiz
      quiz={quiz}
      onReset={() => {
        resetQuiz();
        setFile(null);
      }}
      onComplete={(score: number) => {
        onQuizComplete(score);
        setFile(null);
      }}
    />
  ) : (
    <UploadPDF
      file={file}
      setFile={setFile}
      generateQuiz={generateQuiz}
      loading={loading}
    />
  );
}
