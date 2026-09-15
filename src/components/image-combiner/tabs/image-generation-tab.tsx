import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  RefObject,
} from "react";
import { InputSection } from "../input-section";
import { OutputSection } from "../output-section";
import { GenerationHistory } from "../generation-history-refactor";
import { Generation, AspectRatioOption } from "../types";

interface ImageGenerationTabProps {
  isMobile: boolean;
  mode: "text-to-image" | "image-editing";
  setMode: (mode: "text-to-image" | "image-editing") => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  availableAspectRatios: AspectRatioOption[];
  useUrls: boolean;
  setUseUrls: (use: boolean) => void;
  image1Preview: string;
  image2Preview: string;
  image1Url: string;
  image2Url: string;
  isConvertingHeic: boolean;
  canGenerate: boolean;
  hasImages: boolean;
  runGeneration: () => void;
  clearAll: () => void;
  handleImageUpload: (file: File, slot: 1 | 2) => Promise<void>;
  handleUrlChange: (url: string, slot: 1 | 2) => void;
  clearImage: (slot: 1 | 2) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handlePromptPaste: (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => Promise<void>;
  openFullscreen: () => void;
  promptTextareaRef: RefObject<HTMLTextAreaElement | null>;
  persistedGenerations: Generation[];
  selectedGenerationId: string | null;
  setSelectedGenerationId: (id: string | null) => void;
  cancelGeneration: (id: string) => void;
  deleteGeneration: (id: string) => Promise<void>;
  historyLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  isLoadingMore: boolean;
  selectedGeneration: Generation | undefined;
  heicProgress: number;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
  loadGeneratedAsInput: () => void;
  copyImageToClipboard: () => Promise<void>;
  downloadImage: () => Promise<void>;
  openImageInNewTab: () => Promise<void>;
}

export const ImageGenerationTab = ({
  isMobile,
  mode,
  setMode,
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  availableAspectRatios,
  useUrls,
  setUseUrls,
  image1Preview,
  image2Preview,
  image1Url,
  image2Url,
  isConvertingHeic,
  canGenerate,
  hasImages,
  runGeneration,
  clearAll,
  handleImageUpload,
  handleUrlChange,
  clearImage,
  handleKeyDown,
  handlePromptPaste,
  openFullscreen,
  promptTextareaRef,
  persistedGenerations,
  selectedGenerationId,
  setSelectedGenerationId,
  cancelGeneration,
  deleteGeneration,
  historyLoading,
  hasMore,
  loadMore,
  isLoadingMore,
  selectedGeneration,
  heicProgress,
  imageLoaded,
  setImageLoaded,
  loadGeneratedAsInput,
  copyImageToClipboard,
  downloadImage,
  openImageInNewTab,
}: ImageGenerationTabProps) => {
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const offsetX = e.clientX - containerRect.left;
      const percentage = (offsetX / containerRect.width) * 100;
      const clampedPercentage = Math.max(30, Math.min(70, percentage));
      setLeftWidth(clampedPercentage);
    },
    [isResizing],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    setLeftWidth(50);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex flex-col gap-4 xl:gap-0">
      <div
        ref={containerRef}
        className="flex flex-col xl:flex-row gap-4 xl:gap-0 xl:min-h-[60vh] 2xl:min-h-[62vh]"
      >
        <div
          className="flex flex-col xl:pl-4 xl:pr-4 xl:border-r xl:border-white/10 xl:pt-5 shrink-0 xl:overflow-y-auto xl:max-h-[85vh] 2xl:max-h-[80vh]"
          style={{ width: isMobile ? "100%" : `${leftWidth}%` }}
        >
          <InputSection
            mode={mode}
            setMode={setMode}
            prompt={prompt}
            setPrompt={setPrompt}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            availableAspectRatios={availableAspectRatios}
            useUrls={useUrls}
            setUseUrls={setUseUrls}
            image1Preview={image1Preview}
            image2Preview={image2Preview}
            image1Url={image1Url}
            image2Url={image2Url}
            isConvertingHeic={isConvertingHeic}
            canGenerate={canGenerate}
            hasImages={hasImages}
            onGenerate={runGeneration}
            onClearAll={clearAll}
            onImageUpload={handleImageUpload}
            onUrlChange={handleUrlChange}
            onClearImage={clearImage}
            onKeyDown={handleKeyDown}
            onPromptPaste={handlePromptPaste}
            onImageFullscreen={openFullscreen}
            promptTextareaRef={promptTextareaRef}
            generations={persistedGenerations}
            selectedGenerationId={selectedGenerationId}
            onSelectGeneration={setSelectedGenerationId}
            onCancelGeneration={cancelGeneration}
            onDeleteGeneration={deleteGeneration}
            historyLoading={historyLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            isLoadingMore={isLoadingMore}
          />

          {/* Desktop History */}
          <div className="hidden xl:block mt-3 shrink-0">
            <GenerationHistory
              generations={persistedGenerations}
              selectedId={selectedGenerationId ?? undefined}
              onSelect={setSelectedGenerationId}
              onCancel={cancelGeneration}
              onDelete={deleteGeneration}
              isLoading={historyLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
            />
          </div>
        </div>

        <div
          className="hidden xl:flex items-center justify-center cursor-col-resize hover:bg-white/10 transition-colors relative group"
          style={{ width: "8px", flexShrink: 0 }}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          onMouseUp={handleMouseUp}
        >
          <div className="w-0.5 h-8 bg-white/20 group-hover:bg-white/40 transition-colors rounded-full" />
        </div>
        <div
          className="flex flex-col xl:pl-4 xl:pr-4 h-[400px] sm:h-[500px] md:h-[600px] xl:h-auto shrink-0"
          style={{
            width: isMobile ? "100%" : `${100 - leftWidth}%`,
          }}
        >
          <OutputSection
            selectedGeneration={selectedGeneration}
            generations={persistedGenerations}
            selectedGenerationId={selectedGenerationId}
            setSelectedGenerationId={setSelectedGenerationId}
            isConvertingHeic={isConvertingHeic}
            heicProgress={heicProgress}
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
            onCancelGeneration={cancelGeneration}
            onDeleteGeneration={deleteGeneration}
            onOpenFullscreen={openFullscreen}
            onLoadAsInput={loadGeneratedAsInput}
            onCopy={copyImageToClipboard}
            onDownload={downloadImage}
            onOpenInNewTab={openImageInNewTab}
          />
        </div>
      </div>

      {/* Mobile History */}
      <div className="xl:hidden shrink-0">
        <GenerationHistory
          generations={persistedGenerations}
          selectedId={selectedGenerationId ?? undefined}
          onSelect={setSelectedGenerationId}
          onCancel={cancelGeneration}
          onDelete={deleteGeneration}
          isLoading={historyLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isLoadingMore={isLoadingMore}
        />
      </div>
    </div>
  );
};
