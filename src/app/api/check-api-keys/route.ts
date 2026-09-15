import { NextResponse } from "next/server";

export async function GET() {
  try {
    const available = {
      gemini: !!process.env.GEMINI_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      claude: !!process.env.ANTHROPIC_API_KEY,
      llama: !!process.env.LLAMA_API_KEY,
      dalle: !!process.env.OPENAI_API_KEY, // DALL-E uses OpenAI key
      stability: !!process.env.STABILITY_API_KEY,
    };

    return NextResponse.json({ available });
  } catch (error) {
    console.error("Error checking API keys:", error);
    return NextResponse.json(
      { error: "Failed to check API keys" },
      { status: 500 },
    );
  }
}
