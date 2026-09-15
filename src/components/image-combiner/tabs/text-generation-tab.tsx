import React, { RefObject } from "react";
import {
  SvgChatIcon,
  SvgCopyIcon,
  SvgSendLoadIcon,
  SvgSendIcons,
} from "../icons";

interface TextGenerationTabProps {
  textConversations: Array<{
    id: string;
    prompt: string;
    response: string;
    timestamp: number;
  }>;
  isGeneratingText: boolean;
  chatContainerRef: RefObject<HTMLDivElement | null>;
  textPrompt: string;
  setTextPrompt: (prompt: string) => void;
  handleGenerateText: () => void;
  selectedAiModel: string;
}

export const TextGenerationTab = ({
  textConversations,
  isGeneratingText,
  chatContainerRef,
  textPrompt,
  setTextPrompt,
  handleGenerateText,
  selectedAiModel,
}: TextGenerationTabProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
        {/* Conversation History */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
        >
          {textConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <SvgChatIcon />
              <p className="text-gray-400 text-lg font-medium mb-2">
                Start a conversation
              </p>
              <p className="text-gray-500 text-sm max-w-md">
                Enter a prompt below to generate AI-powered text responses
              </p>
            </div>
          ) : (
            textConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="space-y-3 animate-in slide-in-from-bottom-2 duration-300"
              >
                {/* User Message */}
                <div className="flex justify-end animate-in slide-in-from-right-4 duration-300">
                  <div className="max-w-[85%] bg-linear-to-r from-purple-600 to-violet-600 backdrop-blur-sm text-white rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-xl">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                      {conversation.prompt}
                    </p>
                    <p className="text-xs text-purple-200 mt-2 opacity-70">
                      {new Date(conversation.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start animate-in slide-in-from-left-4 duration-500">
                  <div className="max-w-[85%] bg-gray-800/70 backdrop-blur-sm text-gray-100 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-xl border border-purple-500/30">
                    <div className="text-sm leading-relaxed space-y-2">
                      {conversation.response
                        .split("\n")
                        .map((paragraph, idx) =>
                          paragraph.trim() ? (
                            <p
                              key={idx}
                              className="whitespace-pre-wrap wrap-break-word"
                            >
                              {paragraph}
                            </p>
                          ) : (
                            <div key={idx} className="h-2" />
                          ),
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-700/50">
                      <SvgCopyIcon />
                      <p className="text-xs text-gray-400 font-medium">
                        AI Response • {selectedAiModel || "AI"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading State */}
          {isGeneratingText && (
            <div className="flex justify-start animate-in slide-in-from-left-4 duration-300">
              <div className="max-w-[85%] bg-gray-800/70 backdrop-blur-sm text-gray-100 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-xl border border-purple-500/30">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div
                      className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="text-sm text-gray-300 font-medium animate-pulse">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 bg-linear-to-b from-gray-900/80 to-gray-900/95 backdrop-blur-sm p-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerateText();
                  }
                }}
                className="w-full p-5 bg-gray-800/60 border-2 border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none shadow-xl shadow-black/20 hover:border-gray-600/50"
                rows={4}
                placeholder="Type your message here... ✨\n(Press Enter to send, Shift+Enter for new line)"
                disabled={isGeneratingText}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500 pointer-events-none">
                {textPrompt.length} characters
              </div>
            </div>
            <button
              onClick={handleGenerateText}
              disabled={!textPrompt.trim() || isGeneratingText}
              className="w-full px-8 py-4 bg-linear-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 disabled:from-gray-700 disabled:via-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/40 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              {isGeneratingText ? (
                <>
                  <SvgSendLoadIcon />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <SvgSendIcons />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
