import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"

const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
import Header from "./components/Header";
export const metadata: Metadata = {
  title: "DevOra - Q&A Platform",
  description: "A community for developers to ask and answer questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "dark:bg-black dark:text-white antialiased text-left leading-relaxed")}>
        <Header />
        {children}</body>
    </html>
  );
}
