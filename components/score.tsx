"use client";
import { Card, CardContent } from "@/components/ui/card";
import { SupportedLanguage } from "@/locales/.generated/types";
import { useParams } from "next/navigation";
import {
  correctAnswers as correctAnswersMessage,
  goodEffort,
  greatJob,
  keepPracticing,
  notBad,
  perfectScore
} from "@/locales/.generated/server";
interface QuizScoreProps {
  correctAnswers: number;
  totalQuestions: number;
}

export default function QuizScore({
  correctAnswers,
  totalQuestions
}: QuizScoreProps) {
  const params = useParams();
  const lng = (params.lng as SupportedLanguage) || "id";
  const score = (correctAnswers / totalQuestions) * 100;
  const roundedScore = Math.round(score);

  const getMessage = () => {
    if (score === 100) return perfectScore(lng);
    if (score >= 80) return greatJob(lng);
    if (score >= 60) return goodEffort(lng);
    if (score >= 40) return notBad(lng);
    return keepPracticing(lng);
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-8">
        <div className="text-center">
          <p className="text-4xl font-bold">{roundedScore}%</p>
          <p className="text-sm text-muted-foreground">
            {correctAnswersMessage(lng, {
              correctAnswers: correctAnswers.toString(),
              totalQuestions: totalQuestions.toString()
            })}
          </p>
        </div>
        <p className="text-center font-medium">{getMessage()}</p>
      </CardContent>
    </Card>
  );
}
