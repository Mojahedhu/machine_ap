import { ImageCombiner } from "@/components/image-combiner/index";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chatbot - Free AI Creative Playground",
  description:
    "AI Chatbot is your go-to AI creative tool. Create stunning images from text, edit existing images with AI, generate code, and explore multiple AI features.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ImageCombiner />
    </main>
  );
}
