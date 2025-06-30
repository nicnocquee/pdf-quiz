import { useState, useCallback, useEffect, useMemo } from "react";
import { experimental_useObject } from "ai/react";
import { questionsSchema } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { generateQuizTitle } from "@/app/(preview)/actions";
import { SupportedLanguage } from "@/locales/.generated/types";
import { useLocalStorage } from "@nicnocquee/use-local-storage-hook";

// Hash a file using SHA-256 and return a hex string
const hashFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const getQuizKey = (hash?: string) =>
  hash ? `pdf-quiz-questions-${hash}` : undefined;
const getQuizTitleKey = (hash?: string) =>
  hash ? `pdf-quiz-title-${hash}` : undefined;

const usePdfQuiz = (lng: SupportedLanguage) => {
  const [files, setFiles] = useState<File[]>([]);
  const mainFile = files[0];
  const [fileHash, setFileHash] = useState<string | undefined>(undefined);
  const quizKey = useMemo(() => getQuizKey(fileHash), [fileHash]);
  const quizTitleKey = useMemo(() => getQuizTitleKey(fileHash), [fileHash]);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    []
  );
  const [quizTitle, setQuizTitle] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);

  // Compute hash when file changes
  useEffect(() => {
    let cancelled = false;
    if (mainFile) {
      hashFile(mainFile).then((hash) => {
        if (!cancelled) setFileHash(hash);
      });
    } else {
      setFileHash(undefined);
    }
    return () => {
      cancelled = true;
    };
  }, [mainFile]);

  // Dynamically use localStorage only if quizKey is defined
  const [storedQuestions, setStoredQuestions, clearStoredQuestions] =
    useLocalStorage<z.infer<typeof questionsSchema>>(
      quizKey || "__no_pdf__",
      []
    );
  const [storedQuizTitle, setStoredQuizTitle, clearStoredQuizTitle] =
    useLocalStorage<string>(quizTitleKey || "__no_pdf_title__", "");

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
      if (quizKey) setStoredQuestions(object ?? []);
      if (quizTitleKey && quizTitle) setStoredQuizTitle(quizTitle);
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
      if (quizTitleKey) setStoredQuizTitle(generatedTitle);
    },
    [files, submit, quizTitleKey, setStoredQuizTitle]
  );

  const clearPDF = useCallback(() => {
    setFiles([]);
    setQuestions([]);
    setQuizTitle("");
    if (quizKey) clearStoredQuestions();
    if (quizTitleKey) clearStoredQuizTitle();
  }, [clearStoredQuestions, quizKey, quizTitleKey, clearStoredQuizTitle]);

  useEffect(() => {
    if (
      storedQuestions &&
      storedQuestions.length > 0 &&
      questions.length === 0
    ) {
      setQuestions(storedQuestions);
    }
    if (storedQuizTitle && !quizTitle) {
      setQuizTitle(storedQuizTitle);
    }
  }, [quizKey, storedQuestions, storedQuizTitle, questions.length, quizTitle]);

  const progressValue = partialQuestions
    ? (partialQuestions.length / 4) * 100
    : 0;

  // Reset all in-memory state but do NOT clear local storage
  const resetQuizState = useCallback(() => {
    setFiles([]);
    setQuestions([]);
    setQuizTitle("");
    setFileHash(undefined);
  }, []);

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
    progressValue,
    resetQuizState
  };
};

export default usePdfQuiz;
