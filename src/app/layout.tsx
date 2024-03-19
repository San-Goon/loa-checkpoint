import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/app/_component/Header";
import Footer from "@/app/_component/Footer";
import RQProvider from "@/app/_component/RQProvider";
import { Toaster } from "@/components/ui/toaster";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "로아검문소: 로스트아크 영상인식 군장검사",
  description:
    "로스트아크 군장검사를 영상인식을 통해 자동화시킨 사이트 입니다.",
  keywords: [
    "로아",
    "로스트아크",
    "군장검사",
    "공격대",
    "공격대모집",
    "구인구직",
    "캐릭터정보",
  ],
  verification: {
    google: "IO8qsepjZRvC7Tz1JXVu6-neMi3rYARGSU4wFyj6Qck",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RQProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>
            <Analytics />
            <SpeedInsights />
            <Toaster />
          </RQProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
