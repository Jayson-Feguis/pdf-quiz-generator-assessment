import { QuizData } from "@/types/quiz.type";
import { useState } from "react";
import { toast } from "sonner";

export function useQuiz() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async (file: File | null) => {
    if (!file) {
      toast("No file selected", {
        description: "Please select a PDF file first",
      });
      return;
    }

    console.log("=== Starting Quiz Generation ===");
    console.log("File:", file.name, "Size:", file.size, "Type:", file.type);

    toast("Processing PDF", {
      description: "Extracting text and generating quiz questions...",
    });

    try {
      setLoading(true);
      console.log("Creating FormData...");
      const formData = new FormData();
      formData.append("pdf", file);

      console.log("Making API request to /api/generate-quiz...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        type: response.type,
        headers: {
          "content-type": response.headers.get("content-type"),
          "content-length": response.headers.get("content-length"),
        },
      });

      // Get the raw response text
      const responseText = await response.text();
      console.log(
        "Raw response text (first 500 chars):",
        responseText.substring(0, 500)
      );
      console.log("Response text length:", responseText.length);

      // Handle different response scenarios
      if (!response.ok) {
        console.error("Response not OK, status:", response.status);

        let errorMessage = `Server error (${response.status})`;

        // Try to extract error from response
        if (responseText) {
          if (responseText.includes("Internal Server Error"))
            errorMessage =
              "Internal server error occurred. Please check your environment configuration and try again.";
          else if (responseText.includes("404"))
            errorMessage =
              "API endpoint not found. Please check your server configuration.";
          else if (responseText.includes("500"))
            errorMessage =
              "Server configuration error. Please check your environment variables.";
          else {
            // Try to parse as JSON for structured error
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.error || errorMessage;
            } catch {
              // If not JSON, use first 200 characters of response
              errorMessage =
                responseText.length > 200
                  ? responseText.substring(0, 200) + "..."
                  : responseText || errorMessage;
            }
          }
        }

        throw new Error(errorMessage);
      }

      // Parse successful response
      if (!responseText.trim()) throw new Error("Empty response from server");

      let quizData;
      try {
        quizData = JSON.parse(responseText);
        console.log("Successfully parsed quiz data:", {
          title: quizData.title,
          questionCount: quizData.questions?.length,
          hasMetadata: !!quizData.metadata,
        });
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        console.log("Response that failed to parse:", responseText);
        throw new Error(
          "Server returned invalid response format. Please try again."
        );
      }

      // Validate quiz data structure
      if (
        !quizData.title ||
        !quizData.questions ||
        !Array.isArray(quizData.questions)
      ) {
        console.error("Invalid quiz data structure:", quizData);
        throw new Error("Invalid quiz data received from server");
      }

      const quizId = Date.now().toString();

      setQuiz(quizData);
      setCurrentQuizId(quizId);

      toast("Quiz generated successfully!", {
        description: `Created ${quizData.questions.length} questions from ${
          quizData.metadata?.pageCount || "your"
        } pages`,
      });

      console.log("=== Quiz Generation Completed Successfully ===");
    } catch (err) {
      console.error("=== Quiz Generation Failed ===");
      console.error("Error:", err);

      let errorMessage = "Failed to generate quiz. Please try again.";

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage =
            "Request timed out. Please try with a smaller PDF or check your connection.";
        } else {
          errorMessage = err.message;
        }
      }

      toast("Quiz generation failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
      console.log("=== Quiz Generation Process Finished ===");
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setCurrentQuizId(null);
  };

  const onQuizComplete = (score: number) => {
    const percentage = Math.round((score / quiz!.questions.length) * 100);
    toast("Quiz completed!", {
      description: `You scored ${score}/${
        quiz!.questions.length
      } (${percentage}%)`,
    });
  };

  return {
    quiz,
    setQuiz,
    currentQuizId,
    setCurrentQuizId,
    generateQuiz,
    resetQuiz,
    onQuizComplete,
    loading,
  };
}
