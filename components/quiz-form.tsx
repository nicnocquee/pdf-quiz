import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { generateQuiz, generatingQuiz } from "@/locales/.generated/server";
import { SupportedLanguage } from "@/locales/.generated/types";
import React from "react";

interface QuizFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  files: File[];
  isLoading: boolean;
  lng: SupportedLanguage;
  children: React.ReactNode;
}

const QuizForm = ({
  onSubmit,
  files,
  isLoading,
  lng,
  children
}: QuizFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {children}
    <Button type="submit" className="w-full" disabled={files.length === 0}>
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{generatingQuiz(lng)}</span>
        </span>
      ) : (
        generateQuiz(lng)
      )}
    </Button>
  </form>
);

export default QuizForm;
