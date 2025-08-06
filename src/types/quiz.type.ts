export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type QuizData = {
  title: string;
  questions: QuizQuestion[];
  metadata?: {
    pageCount: number;
    textLength: number;
    truncated: boolean;
  };
};
