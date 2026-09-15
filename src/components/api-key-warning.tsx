import { AlertCircle } from "lucide-react";

export const ApiKeyWarning = () => {
  return (
    <div className="fixed bottom-6 right-6 bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-4 shadow-2xl max-w-sm z-50 backdrop-blur-sm">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-zinc-200 font-semibold text-sm mb-1">
            AI Provider API Key Required
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            This playground requires an AI provider API key to generate images.
            Please configure your{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
              API_SOURCE
            </code>{" "}
            and add the corresponding API key as environment variables.
          </p>
          <p className="text-zinc-400 text-xs leading-relaxed mt-2">
            Supported providers: Gemini, OpenAI, Grok, or Claude
          </p>
          <a
            href="https://github.com/Mojahedhu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-zinc-100 text-xs underline mt-2 inline-block"
          >
            View setup guide →
          </a>
        </div>
      </div>
    </div>
  );
};
