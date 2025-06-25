import { CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  progress,
  generatingQuestion,
  analyzingPDF
} from "@/locales/.generated/server";
import { SupportedLanguage } from "@/locales/.generated/types";
import React from "react";

interface QuizProgressProps {
  isLoading: boolean;
  progressValue: number;
  partialQuestions: any[] | undefined;
  lng: SupportedLanguage;
}

const QuizProgress = ({
  isLoading,
  progressValue,
  partialQuestions,
  lng
}: QuizProgressProps) =>
  isLoading ? (
    <CardFooter className="flex flex-col space-y-4">
      <div className="w-full space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{progress(lng)}</span>
          <span>{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>
      <div className="w-full space-y-2">
        <div className="grid grid-cols-6 sm:grid-cols-4 items-center space-x-2 text-sm">
          <div
            className={`h-2 w-2 rounded-full ${isLoading ? "bg-yellow-500/50 animate-pulse" : "bg-muted"}`}
          />
          <span className="text-muted-foreground text-center col-span-4 sm:col-span-2">
            {partialQuestions && Array.isArray(partialQuestions)
              ? generatingQuestion(lng, {
                  questionNumber: (
                    partialQuestions.filter(Boolean).length + 1
                  ).toString()
                })
              : analyzingPDF(lng)}
          </span>
        </div>
      </div>
    </CardFooter>
  ) : null;

export default QuizProgress;
