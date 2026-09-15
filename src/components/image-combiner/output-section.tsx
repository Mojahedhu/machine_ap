"use client";

import { useMobile } from "@/hooks/use-mobile";
import { Generation } from "./types";
import { memo, useEffect } from "react";
import { Button } from "../ui/button";
import { ProgressBar } from "./progress-bar";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OutputSectionProps {
  selectedGeneration: Generation | undefined;
  generations: Generation[];
  selectedGenerationId: string | null;
  setSelectedGenerationId: (id: string) => void;
  isConvertingHeic: boolean;
  heicProgress: number;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
  onCancelGeneration: (id: string) => void;
  onDeleteGeneration: (id: string) => void;
  onOpenFullscreen: () => void;
  onLoadAsInput: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onOpenInNewTab: () => void;
}

const SvgInputIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const SvgCopyIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
    <path
      d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
      strokeWidth="2"
    />
  </svg>
);

const SvgDownloadIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const SvgGenerateIcon = () => (
  <svg
    className="w-4 h-4 md:w-8 md:h-8 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </svg>
);

export const OutputSection = ({
  selectedGeneration,
  generations,
  selectedGenerationId,
  setSelectedGenerationId,
  isConvertingHeic,
  heicProgress,
  imageLoaded,
  setImageLoaded,
  onCancelGeneration,
  onDeleteGeneration,
  onOpenFullscreen,
  onLoadAsInput,
  onCopy,
  onDownload,
  onOpenInNewTab,
}: OutputSectionProps) => {
  const isMobile = useMobile();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.tagName === "INPUT";

      if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !isTyping) {
        if (generations.length <= 1) return;

        e.preventDefault();
        const currentIndex = generations.findIndex(
          (g) => g.id === selectedGenerationId,
        );
        if (currentIndex === -1 && generations.length > 0) {
          setSelectedGenerationId(generations[0].id);
          return;
        }

        let newIndex;
        if (e.key === "ArrowLeft") {
          newIndex = currentIndex - 1;
        } else {
          newIndex = currentIndex + 1;
        }

        if (newIndex >= 0 && newIndex < generations.length) {
          setSelectedGenerationId(generations[newIndex].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generations, selectedGenerationId, setSelectedGenerationId]);

  const generatedImage =
    selectedGeneration?.status === "complete" && selectedGeneration.imageUrl
      ? { url: selectedGeneration.imageUrl, prompt: selectedGeneration.prompt }
      : null;

  const RenderButtonsM = memo(function RenderButtons({
    className,
  }: {
    className: string;
  }) {
    return (
      <div className={className}>
        <Button
          onClick={onLoadAsInput}
          disabled={!generatedImage}
          variant="outline"
          size="sm"
          className="text-xs h-7 px-2 md:px-3 bg-transparent border-gray-600 text-white hover:bg-gray-700 flex items-center gap-1 lg:bg-black/80 lg:backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Use as Input"
        >
          <SvgInputIcon />
          <span className="hidden sm:inline">Use as Input</span>
        </Button>
        <Button
          onClick={onCopy}
          disabled={!generatedImage}
          variant="outline"
          size="sm"
          className="text-xs h-7 px-2 md:px-3 bg-transparent border-gray-600 text-white hover:bg-gray-700 flex items-center gap-1 lg:bg-black/80 lg:backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title={isMobile ? "Copy to clipboard" : "Copy to clipboard"}
        >
          <SvgCopyIcon />
          <span className="hidden sm:inline">{isMobile ? "Copy" : "Copy"}</span>
        </Button>
        <Button
          onClick={onDownload}
          disabled={!generatedImage}
          variant="outline"
          size="sm"
          className="text-xs h-7 px-2 md:px-3 bg-transparent border-gray-600 text-white hover:bg-gray-700 flex items-center gap-1 lg:bg-black/80 lg:backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Download image"
        >
          <SvgDownloadIcon />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    );
  });

  return (
    <div className="flex flex-col h-full min-h-0 select-none relative group/output">
      <div className="relative flex-1 min-h-0 flex flex-col">
        {selectedGeneration?.status === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <ProgressBar
              progress={selectedGeneration.progress}
              onCancel={() => onCancelGeneration(selectedGeneration.id)}
            />
          </div>
        ) : isConvertingHeic ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <ProgressBar
              progress={heicProgress}
              onCancel={() => {}}
              isConverting
            />
          </div>
        ) : generatedImage ? (
          <div className="absolute inset-0 flex flex-col select-none">
            <div className="flex-1 flex items-center justify-center relative group max-w-full max-h-full overflow-hidden">
              <Image
                src={generatedImage.url || "/placeholder.svg"}
                alt="Generated"
                className={cn(
                  "max-w-full max-h-full transition-all duration-700 ease-out cursor-pointer",
                  "lg:w-full lg:h-full lg:object-contain",
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
                )}
                onLoad={() => setImageLoaded(true)}
                onClick={onOpenFullscreen}
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center py-6 select-none bg-black/20">
            <div>
              <div className="w-8 h-8 md:w-16 md:h-16 mx-auto mb-3 border border-gray-600 flex items-center justify-center bg-black/50">
                <SvgGenerateIcon />
              </div>
              <p className="text-xs text-gray-400 font-medium py-1 md:py-2">
                Ready to generate
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Mobile/Tablet buttons - below the image container */}
      {true && (
        // eslint-disable-next-line react-hooks/static-components
        <RenderButtonsM className="mt-3 md:mt-4 flex lg:hidden justify-center gap-2 shrink-0" />
      )}
    </div>
  );
};
