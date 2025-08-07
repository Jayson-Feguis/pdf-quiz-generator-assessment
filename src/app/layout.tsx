import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "PDF Quiz Generator",
  description: "Generate quizzes from PDFs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className="min-h-screen relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
          {/* Animated background elements */}
          <div className="absolute h-full inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-800/10 rounded-full filter blur-xl opacity-100 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-800/10 rounded-full filter blur-xl opacity-100 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-purple-800/10 rounded-full filter blur-xl opacity-100 animate-blob animation-delay-4000"></div>
          </div>
          {children}
        </div>
        <Toaster closeButton />
      </body>
    </html>
  );
}
