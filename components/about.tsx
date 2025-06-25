"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { About } from "@/locales/.generated/locales-markdown";
import { SupportedLanguage } from "@/locales/.generated/types";
import { useParams } from "next/navigation";

const AboutCard = () => {
  const params = useParams();
  const lng = params.lng as SupportedLanguage;
  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardContent className="p-6">
        <div className="space-y-4 [&_h1]:text-2xl [&_h1]:font-bold">
          <About lang={lng} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutCard;
