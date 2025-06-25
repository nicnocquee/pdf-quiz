import { PdfQuizClient } from "./pdf-quiz-client";
import AboutCard from "@/components/about";

export const generateStaticParams = async () => {
  return [{ lng: "en" }, { lng: "id" }];
};

export default function Page() {
  return (
    <div className="w-full flex flex-col gap-4">
      <PdfQuizClient />
      <AboutCard />
    </div>
  );
}
