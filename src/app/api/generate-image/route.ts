import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  getAIProvider,
  AI_PROVIDERS,
  AI_MODEL_TO_PROVIDER,
} from "@/lib/ai-provider";
import { google } from "@ai-sdk/google";
import { generateImage } from "ai";

export const dynamic = "force-dynamic";

const MAX_PROMPT_LENGTH = 5000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const mode = formData.get("mode") as string;
    const prompt = formData.get("prompt") as string;
    const aspectRatio = formData.get("aspectRatio") as string;
    const aiModel = formData.get("aiModel") as string;

    // 1. Determine Provider
    const providerOverride =
      aiModel && AI_MODEL_TO_PROVIDER[aiModel]
        ? AI_MODEL_TO_PROVIDER[aiModel]
        : undefined;
    const { provider, providerInfo } = getAIProvider(providerOverride);

    // 2. Quick Validations
    if (!prompt?.trim())
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    if (prompt.length > MAX_PROMPT_LENGTH)
      return NextResponse.json({ error: "Prompt too long" }, { status: 400 });

    // 3. API Key Check (Critical for your frontend hook)
    const apiKey = process.env.OPENAI_API_KEY || process.env.AI_GATWAY_API_KEY;
    if (!apiKey && provider === "openai") {
      return NextResponse.json(
        { error: "configuration error", details: "Missing API Key" },
        { status: 500 },
      );
    }

    // const openai = new OpenAI({ apiKey: apiKey || "" });

    // --- MODE: TEXT TO IMAGE ---
    if (mode === "text-to-image") {
      const sizeMap: Record<string, "1024x1024" | "1024x1792" | "1792x1024"> = {
        square: "1024x1024",
        portrait: "1024x1792",
        landscape: "1792x1024",
      };

      const response = await generateImage({
        model: google.image("gemini-2.5-flash-image"),
        prompt: prompt,
        size: sizeMap[aspectRatio] || "1024x1024",
      });
      // const response = await openai.images.generate({
      //   model: "dall-e-3",
      //   prompt: prompt,
      //   size: sizeMap[aspectRatio] || "1024x1024",
      //   response_format: "b64_json", // Use base64 directly to save a fetch call
      // });

      if (!response.image) {
        return NextResponse.json({ error: "somthing went wrong", status: 500 });
      }

      return NextResponse.json({
        url: `data:image/png;base64,${response.image.base64}`,
        prompt: prompt,
        description: response.providerMetadata,
      });
    }

    // --- MODE: IMAGE EDITING ---
    if (mode === "image-editing") {
      const image1 = formData.get("image1") as File | null;
      const image1Url = formData.get("image1Url") as string;

      let buffer: Buffer;

      if (image1 instanceof File) {
        buffer = Buffer.from(await image1.arrayBuffer());
      } else if (image1Url && image1Url !== "null") {
        const res = await fetch(image1Url);
        buffer = Buffer.from(await res.arrayBuffer());
      } else {
        return NextResponse.json(
          { error: "Image required for editing" },
          { status: 400 },
        );
      }

      // Using OpenAI Variations for the "editing" mode
      const response = await openai.images.createVariation({
        image: await OpenAI.toFile(buffer, "input.png"),
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });

      if (!response.data) {
        return { error: "something went wrong", status: 500 };
      }

      return NextResponse.json({
        url: `data:image/png;base64,${response.data[0].b64_json}`,
        prompt: prompt,
        description: "Variation created successfully",
      });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to process request",
        details: error.stack,
      },
      { status: 500 },
    );
  }
}
