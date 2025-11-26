/**
 * MERIDIAN LIVING - Root Layout
 * 
 * The base layout that wraps all pages.
 * Handles global styles, fonts, and the ambient grain effect.
 */

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian Living",
  description: "Tu vida en el edificio, simplificada. Asistente inteligente para residentes.",
  keywords: ["residencial", "lujo", "amenities", "smart living", "asistente"],
  authors: [{ name: "Meridian Living" }],
  openGraph: {
    title: "Meridian Living",
    description: "Tu vida en el edificio, simplificada.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1f3c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full antialiased">
        {/* Ambient grain overlay for that analog feel */}
        <div className="ambient-grain" aria-hidden="true" />
        
        {/* Main content */}
        {children}
      </body>
    </html>
  );
}
