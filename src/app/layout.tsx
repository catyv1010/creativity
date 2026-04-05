import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Creativity — Where Ideas Come Alive",
  description:
    "La plataforma de presentaciones artísticas potenciada por IA. Crea presentaciones impactantes con canvas infinito, plantillas artísticas y transiciones cinematográficas.",
  keywords: [
    "presentaciones",
    "IA",
    "creatividad",
    "diseño",
    "plantillas",
    "canvas",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
