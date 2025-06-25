import { useState, useCallback } from "react";
import { experimental_useObject } from "ai/react";
import { questionsSchema } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { generateQuizTitle } from "@/app/(preview)/actions";
import { SupportedLanguage } from "@/locales/.generated/types";

const usePdfQuiz = (lng: SupportedLanguage) => {
  const [files, setFiles] = useState<File[]>([]);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [quizTitle, setQuizTitle] = useState<string>();

  const {
    submit,
    object: partialQuestions,
    isLoading
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setQuestions(object ?? []);
    }
  });

  const handleFileChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | { target: { files: FileList | null } }
    ) => {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      if (isSafari && isDragging) {
        toast.error(
          "Safari does not support drag & drop. Please use the file picker."
        );
        return;
      }
      const selectedFiles = Array.from(e.target.files || []);
      const validFiles = selectedFiles.filter(
        (file) =>
          file.type === "application/pdf" && file.size <= 5 * 1024 * 1024
      );
      if (validFiles.length !== selectedFiles.length) {
        toast.error("Only PDF files under 5MB are allowed.");
      }
      setFiles(validFiles);
    },
    [isDragging]
  );

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const encodedFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await encodeFileAsBase64(file)
        }))
      );
      submit({ files: encodedFiles });
      const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
      setQuizTitle(generatedTitle);
    },
    [files, submit]
  );

  const clearPDF = useCallback(() => {
    setFiles([]);
    setQuestions([]);
  }, []);

  const progressValue = partialQuestions
    ? (partialQuestions.length / 4) * 100
    : 0;

  return {
    files,
    setFiles,
    questions,
    setQuestions,
    isDragging,
    setIsDragging,
    quizTitle,
    setQuizTitle,
    partialQuestions,
    isLoading,
    handleFileChange,
    handleSubmitWithFiles,
    clearPDF,
    progressValue
  };
};

export default usePdfQuiz;
