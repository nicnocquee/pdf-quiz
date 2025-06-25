"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import Quiz from "@/components/quiz";
import { AnimatePresence, motion } from "framer-motion";
import { title, upload } from "@/locales/.generated/server";
import { SupportedLanguage } from "@/locales/.generated/types";
import { useParams } from "next/navigation";
import usePdfQuiz from "@/components/use-pdf-quiz";
import PdfDropZone from "@/components/pdf-drop-zone";
import QuizProgress from "@/components/quiz-progress";
import QuizForm from "@/components/quiz-form";

export const PdfQuizClient = () => {
  const params = useParams();
  const lng = (params.lng as SupportedLanguage) || "id";

  // Custom hook for quiz logic and state
  const {
    files,
    questions,
    isDragging,
    setIsDragging,
    quizTitle,
    partialQuestions,
    isLoading,
    handleFileChange,
    handleSubmitWithFiles,
    clearPDF,
    progressValue
  } = usePdfQuiz(lng);

  if (questions.length === 4) {
    return (
      <Quiz
        title={quizTitle ?? "Quiz"}
        questions={questions}
        clearPDF={clearPDF}
      />
    );
  }

  return (
    <div
      className="flex justify-center"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files }
        } as React.ChangeEvent<HTMLInputElement>);
      }}>
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div>Drag and drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">
              {"(PDFs only)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="w-full max-w-2xl h-full border-0 sm:border sm:h-fit mt-12">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="rounded-full bg-primary/10 p-2">
              <p className="text-7xl">🧠</p>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">{title(lng)}</CardTitle>
            <CardDescription className="text-base">
              {upload(lng)}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <QuizForm
            onSubmit={handleSubmitWithFiles}
            files={files}
            isLoading={isLoading}
            lng={lng}>
            <PdfDropZone
              files={files}
              isDragging={isDragging}
              lng={lng}
              onFileChange={handleFileChange}
              setIsDragging={setIsDragging}
            />
          </QuizForm>
        </CardContent>
        <QuizProgress
          isLoading={isLoading}
          progressValue={progressValue}
          partialQuestions={partialQuestions}
          lng={lng}
        />
      </Card>
    </div>
  );
};
