import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JARVIS — Intelligence, at your command",
    template: "%s | JARVIS",
  },
  description:
    "Meet JARVIS: a local-first desktop AI assistant designed to help you think, create, and take action—with privacy and control at the center.",
  applicationName: "JARVIS",
  keywords: [
    "JARVIS AI",
    "desktop AI assistant",
    "offline AI",
    "local AI",
    "Ollama",
    "Windows AI assistant",
    "Linux AI assistant",
    "macOS AI assistant",
  ],
  openGraph: {
    title: "JARVIS — Intelligence, at your command",
    description:
      "A desktop AI assistant built around local intelligence, thoughtful automation, and user control.",
    siteName: "JARVIS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JARVIS — Intelligence, at your command",
    description:
      "A local-first desktop AI assistant. Your machine, your models, your control.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080b10",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
