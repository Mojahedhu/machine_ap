import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai-provider";

export async function GET() {
  try {
    const { provider, providerInfo } = getAIProvider("gemini");

    return NextResponse.json({
      configured: true,
      provider,
      providerName: providerInfo.name,
      supportsImageGeneration: providerInfo.supportsImageGeneration,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Configuration error";

    return NextResponse.json({
      configured: false,
      error: errorMessage,
    });
  }
}
