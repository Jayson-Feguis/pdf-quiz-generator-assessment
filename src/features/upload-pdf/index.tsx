"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Brain, CheckCircle, FileText, Upload } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  generateQuiz: (file: File | null) => Promise<void>;
  loading: boolean;
};

export function UploadPDF({ file, setFile, generateQuiz, loading }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast("File selected", {
        description: `${selectedFile.name} is ready for processing`,
      });
    } else {
      toast("Invalid file", {
        description: "Please select a valid PDF file",
      });
      setFile(null);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <Brain className="relative h-16 w-16 text-purple-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            PDF Quiz Generator
          </h1>
        </div>

        {/* Upload Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-purple-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Upload Your PDF
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Select a PDF document to generate personalized quiz questions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="upload" className="text-base font-medium">
                Choose PDF File
              </Label>
              <div className="relative group">
                <Input
                  id="upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className={cn(
                    "h-20 text-base border-2 border-dashed border-purple-200 hover:border-purple-300 transition-all",
                    file &&
                      "group-hover:opacity-50 duration-500 delay-100 group-hover:cursor-pointer"
                  )}
                />
                {file && (
                  <div className="absolute left-1/2 bottom-3 -translate-x-1/2 transform flex items-center justify-center text-green-600 w-full group-hover:cursor-pointer">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => generateQuiz(file)}
              disabled={!file || loading}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-3" />
                  Generate Quiz
                </>
              )}
            </Button>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
              <h3 className="font-bold text-purple-900 mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                How it works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-700 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Upload PDF</p>
                    <p className="text-sm text-purple-700">
                      Select your document
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-700 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">AI Analysis</p>
                    <p className="text-sm text-purple-700">
                      Extract key concepts
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-700 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Generate Quiz</p>
                    <p className="text-sm text-purple-700">
                      Create 5 smart questions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-700 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Take Quiz</p>
                    <p className="text-sm text-purple-700">
                      Test your knowledge
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
