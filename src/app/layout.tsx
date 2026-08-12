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
  title: "SIKANA | Kuasai Bahasa Jepang",
  description: "Kuasai Hiragana dan Katakana dengan aplikasi memorisasi yang cepat, indah, dan bebas gangguan. Berlatih menggunakan flashcard interaktif, kuis mengetik, dan banyak lagi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans overflow-x-hidden">
        <LanguageProvider>
          <div className="flex flex-col lg:flex-row min-h-screen overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
              <TopNav />
              <main className="flex-1 min-w-0">
                {children}
              </main>
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

