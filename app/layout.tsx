import "./globals.css";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Python Course — From Newbie to Expert",
  description: "Interactive Python course: 8 chapters from print() to a pandas analytics startup capstone, with quizzes and a live in-browser CPython lab via Pyodide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Nav />
        <main className="max-w-6xl mx-auto px-5 pt-24 pb-24 animate-fade-in">{children}</main>
        <footer className="border-t border-slate-800 py-8 text-center text-sm text-muted">
          Built for learners who want to <span className="font-mono text-accent">import pandas as pd</span> and mean it.
        </footer>
      </body>
    </html>
  );
}
