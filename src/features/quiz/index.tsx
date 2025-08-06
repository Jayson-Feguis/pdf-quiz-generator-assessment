"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { PdfInfo } from "@/features/quiz/components/pdf-info";
import { QuizData } from "@/types/quiz.type";
import { cn } from "@/lib/utils";

type Props = {
  quiz: QuizData;
  onReset: () => void;
  onComplete: (score: number) => void;
};

export function Quiz({ quiz, onReset, onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore = calculateScore(newAnswers);
      onComplete(finalScore);
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(selectedAnswers[currentQuestion - 1] ?? null);
    }
  };

  const calculateScore = (answers: number[] = selectedAnswers) => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-emerald-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreGradient = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "from-emerald-500 to-green-600";
    if (percentage >= 60) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  if (showResults) {
    const score = calculateScore();
    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto pt-12 p-6">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm mb-8">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r rounded-full blur-lg opacity-30 animate-pulse",
                      getScoreGradient(score, total)
                    )}
                  ></div>
                  <Trophy
                    className={cn(
                      "relative h-16 w-16",
                      getScoreColor(score, total)
                    )}
                  />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Quiz Complete!
              </CardTitle>
              <CardDescription className="text-xl text-gray-600">
                {quiz.title}
              </CardDescription>
              {quiz.metadata && (
                <div className="mt-6">
                  <PdfInfo
                    pageCount={quiz.metadata.pageCount}
                    textLength={quiz.metadata.textLength}
                    truncated={quiz.metadata.truncated}
                  />
                </div>
              )}
            </CardHeader>

            <CardContent>
              <div className="text-center mb-12">
                <div
                  className={cn(
                    "text-8xl font-bold mb-4",
                    getScoreColor(score, total)
                  )}
                >
                  {score}/{total}
                </div>
                <div
                  className={cn(
                    "text-3xl font-semibold mb-6",
                    getScoreColor(score, total)
                  )}
                >
                  {percentage}% Correct
                </div>
                <div className="max-w-md mx-auto">
                  <Progress value={percentage} className="h-3" />
                </div>
              </div>

              <div className="grid gap-6">
                {quiz.questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <Card
                      key={index}
                      className={cn(
                        "border-l-4 transition-all duration-200",
                        isCorrect
                          ? "border-l-emerald-500 bg-emerald-50/50"
                          : "border-l-red-500 bg-red-50/50"
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg flex-1 pr-4">
                            <span className="text-purple-600 font-bold mr-2">
                              Q{index + 1}.
                            </span>
                            {question.question}
                          </CardTitle>
                          {isCorrect ? (
                            <CheckCircle className="h-7 w-7 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-7 w-7 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-6">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={cn(
                                "p-4 rounded-lg border-2 transition-all",
                                optionIndex === question.correctAnswer
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                  : optionIndex === userAnswer && !isCorrect
                                  ? "bg-red-50 border-red-200 text-red-800"
                                  : "bg-gray-50 border-gray-200"
                              )}
                            >
                              <div className="flex items-center">
                                {optionIndex === question.correctAnswer && (
                                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                                )}
                                {optionIndex === userAnswer && !isCorrect && (
                                  <XCircle className="h-5 w-5 text-red-600 mr-3" />
                                )}
                                <span className="font-semibold text-purple-600 mr-3">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="font-medium">{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-blue-800">
                            <span className="font-bold">💡 Explanation:</span>{" "}
                            {question.explanation}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-center mt-12">
                <Button
                  onClick={onReset}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-12 px-8"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Generate New Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto pt-12 p-6">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {quiz.title}
            </h1>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="text-lg font-bold text-purple-600">
                {currentQuestion + 1} of {quiz.questions.length}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                {currentQuestion + 1}
              </div>
              <CardTitle className="text-2xl text-gray-900 flex-1">
                {question.question}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border-2 transition-all duration-200",
                    selectedAnswer === index
                      ? "border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/30"
                  )}
                >
                  <div className="flex items-center space-x-4 p-6">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      className="border-2 border-purple-300"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer font-medium text-gray-900 text-lg"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-bold rounded-full mr-4 text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-10">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="h-12 px-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={onReset}
                  className="h-12 px-6"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {currentQuestion === quiz.questions.length - 1
                    ? "Finish Quiz"
                    : "Next Question"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
