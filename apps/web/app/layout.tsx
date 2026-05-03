import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Bovion",
  description: "Plataforma SaaS de gestão pecuária e controle financeiro.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
