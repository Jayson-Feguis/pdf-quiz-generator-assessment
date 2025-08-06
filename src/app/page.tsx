"use client";
import { Quiz } from "@/features/quiz";
import { QuizHistory } from "@/features/quiz-history";
import { UploadPDF } from "@/features/upload-pdf";
import { useQuiz } from "@/hooks/use-quiz";
import { useState } from "react";

export default function Home() {
  const {
    quiz,
    loading,
    onQuizComplete,
    resetQuiz,
    generateQuiz,
    loadQuizFromHistory,
  } = useQuiz();
  const [file, setFile] = useState<File | null>(null);

  if (quiz)
    return (
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
    );

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="absolute h-full inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative z-10 flex min-h-screen">
        <QuizHistory loadQuizFromHistory={loadQuizFromHistory} />
        <UploadPDF
          file={file}
          setFile={setFile}
          generateQuiz={generateQuiz}
          loading={loading}
        />
      </div>
    </div>
  );
}
