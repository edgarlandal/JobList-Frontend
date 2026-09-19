import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";

import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Joblist",
  description: "Track your job applications and their status.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${nunito.className} ${nunito.variable} h-full antialiased`}
    >
      <body className="flex flex-col w-full h-full">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}