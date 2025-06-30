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
import Link from "next/link";
import Image from "next/image";

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
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" enableSystem forcedTheme="dark">
          <Toaster position="top-center" richColors />
          <div className="flex flex-row justify-between items-center p-4">
            <Link href={`/${lng}`} className="text-2xl font-bold">
              AI🧠PDF
            </Link>
            <UserSession lng={lng} />
          </div>
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
