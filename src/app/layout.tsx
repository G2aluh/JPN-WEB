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
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "SIKANA | Master Japanese Kana",
  description: "Master Japanese Hiragana and Katakana with a fast, gorgeous, and distraction-free memorization app. Practice using interactive flashcards, typing quizzes, and more.",
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
      <body className="min-h-full bg-background text-foreground font-sans">
        <LanguageProvider>
          <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <TopNav />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

