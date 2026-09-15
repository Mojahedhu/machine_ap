import type React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "AI Chatbot - AI Creative Playground",
  description:
    "AI Chatbot: Create and edit stunning images with advanced AI capabilities. Generate text, code, and more with our powerful AI tools.",
  keywords: [
    "ai chatbot",
    "chatbot",
    "ai chat",
    "AI image generation",
    "AI image editor",
    "AI text generation",
    "AI code generation",
    "text to image",
    "AI art generator",
    "image editing AI",
  ],
  authors: [{ name: "AI Chatbot" }],
  creator: "AI Chatbot",
  publisher: "AI Chatbot",
  metadataBase: new URL("https://ai-chatbot.reactbd.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-chatbot.reactbd.com",
    title: "AI Chatbot - AI Creative Playground",
    description:
      "AI Chatbot: Google's newest AI image generation model. Create and edit stunning images with advanced AI.",
    siteName: "AI Chatbot",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Chatbot Playground - AI Image Generation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chatbot Playground - Powered by Vercel AI Gateway",
    description:
      "AI Chatbot: Google's newest AI image generation model. Create and edit stunning images with advanced AI.",
    creator: "@vercel",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      style={{ backgroundColor: "#000000" }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="font-mono antialiased"
        style={{ backgroundColor: "#000000" }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
