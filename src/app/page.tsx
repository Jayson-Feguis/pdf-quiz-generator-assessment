"use client";
import { Quiz } from "@/features/quiz";
import { QuizHistory } from "@/features/quiz-history";
import { UploadPDF } from "@/features/upload-pdf";
import { useQuiz } from "@/hooks/use-quiz";
import { cn } from "@/lib/utils";
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

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
      {/* Animated background elements */}
      <div className="absolute h-full inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-800/10 rounded-full filter blur-xl opacity-100 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-800/10 rounded-full filter blur-xl opacity-100 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-800/10 rounded-full filter blur-xl opacity-100 animate-blob animation-delay-4000"></div>
      </div>
      <div
        className={cn(
          "relative z-10 flex min-h-screen",
          quiz && "justify-center"
        )}
      >
        {quiz ? (
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
          <>
            <QuizHistory loadQuizFromHistory={loadQuizFromHistory} />
            <UploadPDF
              file={file}
              setFile={setFile}
              generateQuiz={generateQuiz}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
}
