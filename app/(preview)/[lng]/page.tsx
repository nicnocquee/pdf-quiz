import { PdfQuizClient } from "./pdf-quiz-client";

export const generateStaticParams = async () => {
  return [{ lng: "en" }, { lng: "id" }];
};

export default function Page() {
  return <PdfQuizClient />;
}
