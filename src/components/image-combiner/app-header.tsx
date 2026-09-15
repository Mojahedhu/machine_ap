import React from "react";
import { SvgChangeIcon } from "./icons";
import { Shimmer } from "../ai-elements/shimmer";

interface AppHeaderProps {
  setShowAiModal: (show: boolean) => void;
  selectedAiModel: string;
}

export const AppHeader = ({
  setShowAiModal,
  selectedAiModel,
}: AppHeaderProps) => {
  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-white/30 px-4 py-3 md:px-6 md:py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white select-none leading-none">
                <Shimmer>AI Chatbot</Shimmer>
              </h1>
              <p className="text-[10px] md:text-xs text-gray-400 select-none mt-1">
                AI-Powered Creative Playground
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-lg transition-all group"
          >
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <div className="text-left">
              <div className="text-xs font-semibold text-teal-300">
                {selectedAiModel || "No model selected"}
              </div>
              <div className="text-[9px] text-teal-400/60">Click to change</div>
            </div>
            <SvgChangeIcon />
          </button>
        </div>
      </div>
    </header>
  );
};
