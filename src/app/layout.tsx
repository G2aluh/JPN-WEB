import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Kana Flow | Minimal Japanese Kana Memorization App",
  description: "Master Japanese Hiragana and Katakana with a fast, gorgeous, and distraction-free memorization app. Practice using 3D interactive flashcards, typing quizzes, and multiple-choice modes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

