import React from "react";
import { modelsByProvider, providers } from "../constants/ai-models";

interface AiModelSelectorModalProps {
  showAiModal: boolean;
  setShowAiModal: (show: boolean) => void;
  selectedProvider: string;
  setSelectedProvider: (providerId: string) => void;
  selectedAiModel: string;
  setSelectedAiModel: (modelName: string) => void;
  availableKeys: Record<string, boolean>;
}

export const AiModelSelectorModal = ({
  showAiModal,
  setShowAiModal,
  selectedProvider,
  setSelectedProvider,
  selectedAiModel,
  setSelectedAiModel,
  availableKeys,
}: AiModelSelectorModalProps) => {
  if (!showAiModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setShowAiModal(false)}
      />

      {/* Modal */}
      <div className="relative bg-linear-to-br from-gray-900 to-black border border-teal-500/30 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 animate-pulse pointer-events-none" />
        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Select AI Model
                </h3>
                <p className="text-xs text-gray-400">
                  Choose your preferred AI model
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAiModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Provider Tabs */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
            {providers.map((provider) => {
              const isActive = selectedProvider === provider.id;
              const hasKey = availableKeys[provider.keyName];
              return (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  disabled={!hasKey}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                    !hasKey
                      ? "opacity-30 cursor-not-allowed! bg-gray-800/50 text-gray-500"
                      : isActive
                        ? "bg-teal-500/20 text-teal-300 border-2 border-teal-500"
                        : "bg-gray-800/50 text-gray-400 border-2 border-gray-700 hover:border-teal-500/50 hover:text-teal-400"
                  }`}
                >
                  {provider.name}
                  {!hasKey && <span className="ml-1 text-[10px]">🔒</span>}
                </button>
              );
            })}
          </div>

          {/* AI Models Grid - filtered by selected provider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
            {modelsByProvider[
              selectedProvider as keyof typeof modelsByProvider
            ]?.map((model) => {
              const hasKey = availableKeys[model.keyName];
              const isSelected = selectedAiModel === model.name;

              // Define color classes based on model color
              const getColorClasses = (color: string) => {
                const colorMap: Record<
                  string,
                  {
                    bg: string;
                    border: string;
                    shadow: string;
                    text: string;
                    badge: string;
                  }
                > = {
                  green: {
                    bg: "bg-green-500/20",
                    border: "border-green-500",
                    shadow: "shadow-green-500/20",
                    text: "text-green-400",
                    badge: "bg-green-500/20 text-green-300",
                  },
                  teal: {
                    bg: "bg-teal-500/20",
                    border: "border-teal-500",
                    shadow: "shadow-teal-500/20",
                    text: "text-teal-400",
                    badge: "bg-teal-500/20 text-teal-300",
                  },
                  purple: {
                    bg: "bg-purple-500/20",
                    border: "border-purple-500",
                    shadow: "shadow-purple-500/20",
                    text: "text-purple-400",
                    badge: "bg-purple-500/20 text-purple-300",
                  },
                  blue: {
                    bg: "bg-blue-500/20",
                    border: "border-blue-500",
                    shadow: "shadow-blue-500/20",
                    text: "text-blue-400",
                    badge: "bg-blue-500/20 text-blue-300",
                  },
                  orange: {
                    bg: "bg-orange-500/20",
                    border: "border-orange-500",
                    shadow: "shadow-orange-500/20",
                    text: "text-orange-400",
                    badge: "bg-orange-500/20 text-orange-300",
                  },
                  pink: {
                    bg: "bg-pink-500/20",
                    border: "border-pink-500",
                    shadow: "shadow-pink-500/20",
                    text: "text-pink-400",
                    badge: "bg-pink-500/20 text-pink-300",
                  },
                };
                return colorMap[color] || colorMap.teal;
              };

              const colors = getColorClasses(model.color);
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    if (hasKey) {
                      setSelectedAiModel(model.name);
                      setShowAiModal(false);
                    }
                  }}
                  disabled={!hasKey}
                  className={`text-left p-4 rounded-xl border-2 transition-all group relative ${
                    !hasKey
                      ? "opacity-50 cursor-not-allowed! bg-gray-900/50 border-gray-700"
                      : isSelected
                        ? `${colors.bg} ${colors.border} shadow-lg ${colors.shadow}`
                        : `bg-gray-800/50 border-gray-700 hover:${colors.border} hover:bg-gray-800`
                  }`}
                >
                  {!hasKey && (
                    <div className="absolute top-2 right-2 bg-red-500/20 border border-red-500/50 rounded px-2 py-0.5">
                      <span className="text-[10px] text-red-400 font-medium">
                        No API Key
                      </span>
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 bg-linear-to-br ${model.gradient} rounded-lg flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-sm">
                          {model.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {model.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {
                            providers.find((p) => p.id === selectedProvider)
                              ?.name
                          }
                        </p>
                      </div>
                    </div>
                    {isSelected && hasKey && (
                      <svg
                        className={`w-5 h-5 ${colors.text}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mb-2">
                    {model.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {model.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className={`text-[10px] px-2 py-0.5 ${colors.badge} rounded-full`}
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-6 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
            <p className="text-xs text-teal-300 flex items-start gap-2">
              <svg
                className="w-4 h-4 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>

              <span>
                Model selection affects capabilities across different tabs. Some
                models specialize in specific tasks like image generation or
                code writing.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
