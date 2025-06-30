import "@/app/(preview)/globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { Footer } from "./footer";
import { SupportedLanguage } from "@/locales/.generated/types";
import {
  metadataDescription,
  title,
  metadataKeywords,
  name
} from "@/locales/.generated/server";
import UserSession from "@/components/user-session";

const geist = Geist({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params
}: {
  params: Promise<{ lng: SupportedLanguage }>;
}) => {
  const lng = ((await params).lng as SupportedLanguage) || "id";
  return {
    metadataBase: new URL(process.env.BASE_URL || "http://localhost:3000"),
    title: `${name(lng)} | ${title(lng)}`,
    description: metadataDescription(lng),
    keywords: metadataKeywords(lng)
  };
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lng: SupportedLanguage }>;
}>) {
  const lng = (await params).lng;
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body className="pb-16">
        <ThemeProvider attribute="class" enableSystem forcedTheme="dark">
          <Toaster position="top-center" richColors />
          <UserSession lng={lng} />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
