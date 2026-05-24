import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Финансовая диагностика Алексея Шаргатова",
  description:
    "Мини-диагностика финансового состояния и персональный отчёт от Алексея Шаргатова. Финансовая стратегия. Спокойствие. Наследие.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.variable}>
        <Suspense fallback={null}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  );
}
