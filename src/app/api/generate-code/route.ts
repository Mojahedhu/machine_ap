import { NextResponse } from "next/server";
import { generateText } from "ai";
import {
  getAIProvider,
  getAIModel,
  AI_MODEL_TO_PROVIDER,
  type AIProvider,
} from "@/lib/ai-provider";

export async function POST(request: Request) {
  try {
    const { prompt, language, aiModel } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 },
      );
    }
    console.log(aiModel);
    // Determine provider from selected AI model
    const provider =
      aiModel && AI_MODEL_TO_PROVIDER[aiModel]
        ? AI_MODEL_TO_PROVIDER[aiModel]
        : undefined;
    // Get the provider and model
    const providerConfig = getAIProvider(provider);
    const model = getAIModel(false, provider);

    console.log(model, providerConfig);
    console.log(
      `Using provider: ${providerConfig.providerInfo.name} for code generation${
        language ? ` in ${language}` : ""
      }`,
    );

    // Language-specific instructions
    const languageInstructions: Record<string, string> = {
      javascript: "Use modern JavaScript (ES6+) with clear variable names",
      typescript: "Use TypeScript with proper type annotations and interfaces",
      python: "Use Python 3 with type hints and follow PEP 8 style guidelines",
      java: "Use Java with proper class structure and JavaDoc comments",
      csharp: "Use C# with proper naming conventions and XML documentation",
      go: "Use Go with idiomatic Go patterns and error handling",
      rust: "Use Rust with proper ownership and borrowing patterns",
      php: "Use modern PHP (7.4+) with type declarations",
      ruby: "Use Ruby with idiomatic Ruby patterns",
      html: "Use semantic HTML5 with proper structure",
      css: "Use modern CSS with clear class names",
      sql: "Use standard SQL with proper formatting",
      bash: "Use Bash with proper error handling and comments",
    };

    const languageInstruction =
      language && languageInstructions[language]
        ? languageInstructions[language]
        : "";

    // Enhanced prompt for code generation
    const codePrompt = `You are an expert programmer. Generate clean, short, well-commented code based on this request:

${prompt}

Requirements:
- Write production-ready code${language ? ` in ${language}` : ""}
${languageInstruction ? `- ${languageInstruction}` : ""}
- Include helpful comments
- Follow best practices for the language
- Make it clear and readable
- Properly format and indent the code

Only respond with the code, no explanations outside the code comments.`;

    // Generate code using AI SDK
    const { text } = await generateText({
      model: model,
      prompt: codePrompt,
    });

    return NextResponse.json({
      code: text,
      provider: providerConfig.providerInfo.name,
      model: providerConfig.providerInfo.defaultModel,
      language: language || "javascript",
    });
  } catch (error: unknown) {
    console.error("Code generation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to generate code",
        details: errorMessage,
        suggestion:
          "Make sure your AI provider API key is correctly configured in .env file",
      },
      { status: 500 },
    );
  }
}
