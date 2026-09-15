import { google, createGoogleGenerativeAI } from "@ai-sdk/google";
import { anthropic, createAnthropic } from "@ai-sdk/anthropic";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { xai, createXai } from "@ai-sdk/xai";

export type AIProvider = "gemini" | "claude" | "openai" | "grok";

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

export interface AIProviderInfo {
  name: string;
  envKeyName: string;
  defaultModel: string;
  imageModel?: string;
  supportsImageGeneration: boolean;
}

// Map AI model display names to their providers
export const AI_MODEL_TO_PROVIDER: Record<string, AIProvider> = {
  // Google Models
  "Gemini 2.5 Flash": "gemini",
  "Gemini 2.5 Flash Lite": "gemini",
  "Gemini 2.0 Flash": "gemini",
  "Gemini 1.5 Pro": "gemini",
  "Gemini 1.5 Flash": "gemini",

  // OpenAI Models
  "GPT-4 Turbo": "openai",
  "GPT-4o": "openai",
  "GPT-3.5 Turbo": "openai",

  // Anthropic Models
  "Claude 3.5 Sonnet": "claude",
  "Claude 3 Opus": "claude",
  "Claude 3 Haiku": "claude",

  // DALL-E Models (via OpenAI)
  "DALL-E 3": "openai",
  "DALL-E 2": "openai",

  // Meta Models (via OpenAI-compatible API)
  "Llama 3.1": "openai",

  // Stability AI (via OpenAI-compatible API)
  "Stable Diffusion XL": "openai",
};

export const AI_PROVIDERS: Record<AIProvider, AIProviderInfo> = {
  gemini: {
    name: "Google Gemini",
    envKeyName: "GEMINI_API_KEY",
    defaultModel: "gemini-2.5-flash",
    imageModel: "gemini-2.5-flash-image",
    supportsImageGeneration: false, // Gemini doesn't support image generation via AI SDK
  },
  claude: {
    name: "Anthropic Claude",
    envKeyName: "ANTHROPIC_API_KEY",
    defaultModel: "claude-3-5-sonnet-20241022",
    supportsImageGeneration: false,
  },
  openai: {
    name: "OpenAI",
    envKeyName: "OPENAI_API_KEY",
    defaultModel: "gpt-4o",
    imageModel: "dall-e-3",
    supportsImageGeneration: true,
  },
  grok: {
    name: "xAI Grok",
    envKeyName: "XAI_API_KEY",
    defaultModel: "grok-2-vision-1212",
    imageModel: "grok-2-vision-1212",
    supportsImageGeneration: false, // Grok doesn't support image generation via AI SDK
  },
};

export function getAIProvider(overrideProvider?: AIProvider) {
  // Use override provider if provided, otherwise default to openai
  const apiSource = (overrideProvider || "openai") as AIProvider;

  if (!AI_PROVIDERS[apiSource]) {
    throw new Error(
      `Invalid provider: ${apiSource}. Must be one of: ${Object.keys(
        AI_PROVIDERS,
      ).join(", ")}`,
    );
  }

  const providerInfo = AI_PROVIDERS[apiSource];
  const apiKey = process.env[providerInfo.envKeyName];

  if (!apiKey) {
    throw new Error(
      `${providerInfo.name} API key not found. Please set ${providerInfo.envKeyName} in environment variables.`,
    );
  }

  return {
    provider: apiSource,
    apiKey,
    providerInfo,
  };
}

export function getAIModel(
  forImageGeneration = false,
  overrideProvider?: AIProvider,
) {
  const { provider, apiKey, providerInfo } = getAIProvider(overrideProvider);

  if (forImageGeneration && !providerInfo.supportsImageGeneration) {
    throw new Error(`${providerInfo.name} does not support image generation`);
  }

  const modelName = forImageGeneration
    ? providerInfo.imageModel || providerInfo.defaultModel
    : providerInfo.defaultModel;

  switch (provider) {
    case "gemini": {
      const googleProvider = createGoogleGenerativeAI({ apiKey });
      return googleProvider(modelName);
    }
    case "claude": {
      const anthropicProvider = createAnthropic({ apiKey });
      return anthropicProvider(modelName);
    }
    case "openai": {
      const openaiProvider = createOpenAI({ apiKey });
      return openaiProvider(modelName);
    }
    case "grok": {
      const xaiProvider = createXai({ apiKey });
      return xaiProvider(modelName);
    }
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export function getProviderSpecificOptions(
  provider: AIProvider,
  aspectRatio: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  const geminiAspectRatioMap: Record<string, string> = {
    portrait: "9:16",
    landscape: "16:9",
    wide: "21:9",
    "4:3": "4:3",
    "3:4": "3:4",
    "3:2": "3:2",
    "2:3": "2:3",
    "5:4": "5:4",
    "4:5": "4:5",
    square: "1:1",
  };

  const openaiSizeMap: Record<string, string> = {
    portrait: "1024x1792",
    landscape: "1792x1024",
    square: "1024x1024",
  };

  switch (provider) {
    case "gemini":
      return {
        google: {
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: geminiAspectRatioMap[aspectRatio] || "1:1",
          },
        },
      };
    case "openai":
      return {
        openai: {
          size: openaiSizeMap[aspectRatio] || "1024x1024",
          quality: "standard",
        },
      };
    case "grok":
      return {
        xai: {
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: geminiAspectRatioMap[aspectRatio] || "1:1",
          },
        },
      };
    default:
      return {};
  }
}
