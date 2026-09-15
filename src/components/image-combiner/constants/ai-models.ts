export interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  icon: string;
  gradient: string;
  color: string;
  keyName: string;
}

export const modelsByProvider: Record<string, AIModel[]> = {
  openai: [
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      description: "Most advanced reasoning and comprehensive knowledge",
      capabilities: ["Text Gen", "Code Gen"],
      icon: "4",
      gradient: "from-green-400 to-emerald-500",
      color: "green",
      keyName: "openai",
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      description: "Optimized for speed and efficiency with multimodal support",
      capabilities: ["Text Gen", "Code Gen", "Vision"],
      icon: "O",
      gradient: "from-green-400 to-emerald-500",
      color: "green",
      keyName: "openai",
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "Fast and efficient for everyday tasks",
      capabilities: ["Text Gen", "Code Gen"],
      icon: "3",
      gradient: "from-green-400 to-emerald-500",
      color: "green",
      keyName: "openai",
    },
  ],
  google: [
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      description:
        "Latest experimental model with enhanced multimodal capabilities",
      capabilities: ["Image Gen", "Text Gen", "Code Gen"],
      icon: "2",
      gradient: "from-teal-400 to-cyan-500",
      color: "teal",
      keyName: "gemini",
    },
    {
      id: "gemini-2.5-flash-lite",
      name: "Gemini 2.5 Flash Lite",
      description:
        "Latest experimental model with enhanced multimodal capabilities",
      capabilities: ["Image Gen", "Text Gen", "Code Gen"],
      icon: "2",
      gradient: "from-teal-400 to-cyan-500",
      color: "teal",
      keyName: "gemini",
    },
    {
      id: "gemini-2.0-flash-exp",
      name: "Gemini 2.0 Flash",
      description:
        "Latest experimental model with enhanced multimodal capabilities",
      capabilities: ["Image Gen", "Text Gen", "Code Gen"],
      icon: "2",
      gradient: "from-teal-400 to-cyan-500",
      color: "teal",
      keyName: "gemini",
    },
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      description: "Advanced reasoning with long context window",
      capabilities: ["Text Gen", "Code Gen", "Vision"],
      icon: "P",
      gradient: "from-teal-400 to-cyan-500",
      color: "teal",
      keyName: "gemini",
    },
    {
      id: "gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      description: "Fast and efficient multimodal AI",
      capabilities: ["Image Gen", "Text Gen", "Code Gen"],
      icon: "F",
      gradient: "from-teal-400 to-cyan-500",
      color: "teal",
      keyName: "gemini",
    },
  ],
  claude: [
    {
      id: "claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      description: "Balanced performance with strong reasoning capabilities",
      capabilities: ["Text Gen", "Code Gen"],
      icon: "S",
      gradient: "from-purple-400 to-pink-500",
      color: "purple",
      keyName: "claude",
    },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      description: "Most powerful model for complex tasks",
      capabilities: ["Text Gen", "Code Gen"],
      icon: "O",
      gradient: "from-purple-400 to-pink-500",
      color: "purple",
      keyName: "claude",
    },
    {
      id: "claude-3-haiku",
      name: "Claude 3 Haiku",
      description: "Fast and compact for quick responses",
      capabilities: ["Text Gen", "Code Gen"],
      icon: "H",
      gradient: "from-purple-400 to-pink-500",
      color: "purple",
      keyName: "claude",
    },
  ],
  dalle: [
    {
      id: "dall-e-3",
      name: "DALL-E 3",
      description: "High-quality AI image generation",
      capabilities: ["Image Gen"],
      icon: "D",
      gradient: "from-blue-400 to-indigo-500",
      color: "blue",
      keyName: "dalle",
    },
    {
      id: "dall-e-2",
      name: "DALL-E 2",
      description: "Reliable image generation model",
      capabilities: ["Image Gen"],
      icon: "2",
      gradient: "from-blue-400 to-indigo-500",
      color: "blue",
      keyName: "dalle",
    },
  ],
  meta: [
    {
      id: "llama-3.1",
      name: "Llama 3.1",
      description: "Open-source model for text generation",
      capabilities: ["Text Gen", "Code Gen"],
      icon: "L",
      gradient: "from-orange-400 to-red-500",
      color: "orange",
      keyName: "llama",
    },
  ],
  stability: [
    {
      id: "stable-diffusion-xl",
      name: "Stable Diffusion XL",
      description: "Advanced open-source image generation",
      capabilities: ["Image Gen"],
      icon: "S",
      gradient: "from-pink-400 to-rose-500",
      color: "pink",
      keyName: "stability",
    },
  ],
};

export const providers = [
  { id: "openai", name: "OpenAI", keyName: "openai" },
  { id: "google", name: "Google", keyName: "gemini" },
  { id: "claude", name: "Anthropic", keyName: "claude" },
  { id: "dalle", name: "DALL-E", keyName: "dalle" },
  { id: "meta", name: "Meta", keyName: "llama" },
  { id: "stability", name: "Stability AI", keyName: "stability" },
];
