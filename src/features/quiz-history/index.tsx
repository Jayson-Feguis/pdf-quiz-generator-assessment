"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuizStore } from "@/lib/zustand";
import { type QuizHistory } from "@/types/quiz.type";
import { Clock, FileText, History, Play, Trash2, Trophy } from "lucide-react";

type Props = {
  loadQuizFromHistory: (historyItem: QuizHistory) => void;
};
export function QuizHistory({ loadQuizFromHistory }: Props) {
  const { quizHistory, deleteQuizHistory } = useQuizStore();

  return (
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-purple-200 p-6">
      <div className="flex items-center mb-6">
        <History className="h-6 w-6 text-purple-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Quiz History</h2>
      </div>

      <ScrollArea className="h-[calc(100vh-120px)]">
        {quizHistory.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No quizzes generated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quizHistory.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-md transition-all duration-200 border-purple-100"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 flex-1">
                      {item.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuizHistory(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {item.totalQuestions} questions
                    </Badge>
                    {item.score !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        <Trophy className="h-3 w-3 mr-1" />
                        {item.score}/{item.totalQuestions}
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadQuizFromHistory(item)}
                    className="w-full text-xs h-7"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {item.score !== undefined ? "Retake" : "Start"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
