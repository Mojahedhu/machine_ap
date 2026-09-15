"use client";

import { useMobile } from "@/hooks/use-mobile";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useImageUpload } from "./hooks/use-image-upload";
import { useAspectRation } from "./hooks/use-aspect-ration";
import { usePersistentHistory } from "./hooks/use-persistent-history";
import { useImageGeneration } from "./hooks/use-image-generation-props";
import { ToastNotification } from "./toast-notification";
import { GlobalDropZone } from "./global-drop";
import { Dithering } from "@paper-design/shaders-react";
import { ApiKeyWarning } from "../api-key-warning";
import { AppHeader } from "./app-header";
import { AppTabNavigation } from "./app-tab-navigation";
import { ImageGenerationTab } from "./tabs/image-generation-tab";
import { useTextGeneration } from "./hooks/use-text-generation";
import { useCodeGeneration } from "./hooks/use-code-generation";
import { useImageActions } from "./hooks/use-image-actions";
import { useGlobalShortcuts } from "./hooks/use-global-shortcuts";
import { useDragDrop } from "./hooks/use-drag-drop";
import { TextGenerationTab } from "./tabs/text-generation-tab";
import { CodeGenerationTab } from "./tabs/code-generation-tab";
import { OtherGenerationTab } from "./tabs/other-generation-tab";
import { AiModelSelectorModal } from "./modals/ai-model-selector-modal";
import { LanguageConversionModal } from "./modals/language-conversion-modal";
import { providers, modelsByProvider } from "./constants/ai-models";
import { HowItWorksModal } from "./how-it-works-modal";
import { FullscreenViewer } from "./fullscreen-viewer";

const MemoizedDithering = memo(Dithering);

export const ImageCombiner = () => {
  const isMobile = useMobile();
  const [generationType, setGenerationType] = useState<
    "text" | "image" | "coding" | "other"
  >("text");
  const [mode, setMode] = useState<"text-to-image" | "image-editing">(
    "text-to-image",
  );
  const [prompt, setPrompt] = useState(
    "A beautiful landscape with mountains and a lake at sunset",
  );

  const [useUrls, setUseUrls] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | undefined;
  } | null>(null);

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedAiModel, setSelectedAiModel] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [availableKeys, setAvailableKeys] = useState<Record<string, boolean>>({
    gemini: false,
    openai: false,
    claude: false,
    llama: false,
    dalle: false,
    stability: false,
  });

  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | undefined) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  // Core Hooks (Pre-existing)
  const {
    image1,
    image1Preview,
    image1Url,
    image2,
    image2Preview,
    image2Url,
    isConvertingHeic,
    heicProgress,
    handleImageUpload,
    handleUrlChange,
    clearImage,
    showToast: _uploadShowToast,
  } = useImageUpload();

  const { aspectRatio, setAspectRatio, availableAspectRatios } =
    useAspectRation();

  const {
    generations: persistedGenerations,
    setGenerations: setPersistedGenerations,
    addGeneration,
    deleteGeneration,
    isLoading: historyLoading,
    hasMore,
    loadMore,
    isLoadingMore,
  } = usePersistentHistory(showToast);

  const {
    selectedGenerationId,
    setSelectedGenerationId,
    imageLoaded,
    setImageLoaded,
    generateImage: runGeneration,
    cancelGeneration,
    loadGeneratedAsInput,
  } = useImageGeneration({
    prompt,
    aspectRatio,
    image1,
    image2,
    image1Url,
    image2Url,
    useUrls,
    aiModel: selectedAiModel,
    generations: persistedGenerations,
    setGenerations: setPersistedGenerations,
    addGeneration,
    onToast: showToast,
    onImageUpload: handleImageUpload,
    onApiKeyMissing: () => setApiKeyMissing(true),
  });

  // Extracted Custom Hooks
  const {
    textPrompt,
    setTextPrompt,
    textConversations,
    isGeneratingText,
    chatContainerRef,
    handleGenerateText,
  } = useTextGeneration({ selectedAiModel, showToast });

  const {
    codePrompt,
    setCodePrompt,
    generatedCode,
    setGeneratedCode,
    isGeneratingCode,
    codeLanguage,
    showConversionModal,
    pendingLanguage,
    showSuggestions,
    setShowSuggestions,
    handleGenerateCode,
    handleLanguageChange,
    confirmLanguageConversion,
    cancelLanguageConversion,
  } = useCodeGeneration({ selectedAiModel });

  const selectedGeneration =
    persistedGenerations.find((g) => g.id === selectedGenerationId) ||
    persistedGenerations[0];
  const generatedImage =
    selectedGeneration?.status === "complete" && selectedGeneration.imageUrl
      ? { url: selectedGeneration.imageUrl, prompt: selectedGeneration.prompt }
      : null;

  const {
    showFullscreen,
    fullscreenImageUrl,
    openFullscreen,
    closeFullscreen,
    handleFullscreenNavigate,
    downloadImage,
    openImageInNewTab,
    copyImageToClipboard,
  } = useImageActions({
    generatedImage,
    currentMode: mode,
    isMobile,
    persistedGenerations,
    setSelectedGenerationId,
    showToast,
  });

  const { isDraggingOver, dropZoneHover, setDropZoneHover, handleGlobalDrop } =
    useDragDrop({
      setUseUrls,
      handleImageUpload,
      showToast,
    });

  const hasImages = Boolean(
    useUrls ? image1Url || image2Url : image1 || image2,
  );
  const canGenerate = Boolean(
    prompt.trim().length > 0 &&
    (mode === "text-to-image" || (useUrls ? image1Url : image1)),
  );

  const { handleKeyDown, handlePromptPaste } = useGlobalShortcuts({
    canGenerate,
    runGeneration,
    generatedImage,
    copyImageToClipboard,
    downloadImage,
    loadGeneratedAsInput,
    showFullscreen,
    closeFullscreen,
    persistedGenerations,
    fullscreenImageUrl,
    setFullscreenImageUrl: (_url: string) => {}, // Managed by image actions natively, but shortcut nav needs updates
    setSelectedGenerationId,
    image1,
    image2,
    image1Url,
    image2Url,
    handleImageUpload,
    handleUrlChange,
    useUrls,
    setUseUrls,
    showToast,
  });

  // Check for available API keys and set default model
  useEffect(() => {
    const checkApiKeys = async () => {
      try {
        const response = await fetch("/api/check-api-keys");
        if (response.ok) {
          const data = await response.json();
          const keys = data.available || {};
          setAvailableKeys(keys);

          if (!selectedAiModel) {
            for (const provider of providers) {
              if (keys[provider.keyName]) {
                const models =
                  modelsByProvider[
                    provider.id as keyof typeof modelsByProvider
                  ];
                if (models && models.length > 0) {
                  setSelectedAiModel(models[0].name);
                  setSelectedProvider(provider.id);
                  break;
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to check API keys:", error);
      }
    };
    checkApiKeys();
  }, [selectedAiModel]);

  // Update prompt based on generation type
  useEffect(() => {
    if (generationType === "text") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrompt(
        "Write a short poem about artificial intelligence and creativity",
      );
    } else if (generationType === "image") {
      setPrompt("A beautiful landscape with mountains and a lake at sunset");
    } else {
      setPrompt("Explore AI capabilities...");
    }
  }, [generationType]);

  // Check API key purely
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/check-api-key");
        const data = await response.json();
        console.log(data.configured);
        if (!data.configured) {
          setApiKeyMissing(true);
        }
      } catch (error) {
        console.error("Error checking API key:", error);
      }
    };
    checkApiKey();
  }, []);

  // Sync image loader reset
  useEffect(() => {
    if (
      selectedGeneration?.status === "complete" &&
      selectedGeneration?.imageUrl
    ) {
      setImageLoaded(false);
    }
  }, [
    selectedGenerationId,
    selectedGeneration?.status,
    selectedGeneration?.imageUrl,
    setImageLoaded,
  ]);

  const clearAll = useCallback(() => {
    setPrompt("");
    clearImage(1);
    clearImage(2);
    setTimeout(() => {
      promptTextareaRef.current?.focus();
    }, 0);
  }, [clearImage]);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Nano Banana Pro",
            alternateName: "NB Pro",
            description:
              "Nano Banana Pro is a powerful AI image generation and editing tool powered by Google Gemini 2.5 Flash Image. Create, edit, and transform images with natural language prompts.",
            url: "",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Web Browser",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: {
              "@type": "Organization",
              name: "moj-dev",
              url: "https://moj-dev.com",
            },
            keywords:
              "moj-dev, AI image generation, AI image editor, free AI image generator, text to image, Gemini image generation",
          }),
        }}
      />
      {toast && (
        <ToastNotification message={toast.message} type={toast.type!} />
      )}

      {isDraggingOver && (
        <GlobalDropZone
          dropZoneHover={dropZoneHover}
          onSetDropZoneHover={setDropZoneHover}
          onDrop={handleGlobalDrop}
        />
      )}

      <div className="fixed inset-0 z-0 select-none shader-background bg-black">
        <MemoizedDithering
          className="absolute z-0"
          colorBack="#00000000"
          colorFront="#005B5B"
          speed={0.43}
          shape="wave"
          type="4x4"
          size={3}
          scale={1.13}
          style={{
            backgroundColor: "#000000",
            height: "100vh",
            width: "100vw",
          }}
        />
        <div className="relative z-10 w-full h-screen flex flex-col">
          <AppHeader
            setShowAiModal={setShowAiModal}
            selectedAiModel={selectedAiModel}
          />
          <AppTabNavigation
            generationType={generationType}
            setGenerationType={setGenerationType}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-black/70 border-3 px-3 py-3 md:px-4 md:py-4 lg:px-6 lg:py-6 rounded-lg">
                {apiKeyMissing && <ApiKeyWarning />}

                {generationType === "text" && (
                  <TextGenerationTab
                    textConversations={textConversations}
                    isGeneratingText={isGeneratingText}
                    chatContainerRef={chatContainerRef}
                    textPrompt={textPrompt}
                    setTextPrompt={setTextPrompt}
                    handleGenerateText={handleGenerateText}
                    selectedAiModel={selectedAiModel}
                  />
                )}

                {generationType === "image" && (
                  <ImageGenerationTab
                    isMobile={isMobile}
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
                    runGeneration={runGeneration}
                    clearAll={clearAll}
                    handleImageUpload={handleImageUpload}
                    handleUrlChange={handleUrlChange}
                    clearImage={clearImage}
                    handleKeyDown={handleKeyDown}
                    handlePromptPaste={handlePromptPaste}
                    openFullscreen={openFullscreen}
                    promptTextareaRef={promptTextareaRef}
                    persistedGenerations={persistedGenerations}
                    selectedGenerationId={selectedGenerationId}
                    setSelectedGenerationId={setSelectedGenerationId}
                    cancelGeneration={cancelGeneration}
                    deleteGeneration={deleteGeneration}
                    historyLoading={historyLoading}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    isLoadingMore={isLoadingMore}
                    selectedGeneration={selectedGeneration}
                    heicProgress={heicProgress}
                    imageLoaded={imageLoaded}
                    setImageLoaded={setImageLoaded}
                    loadGeneratedAsInput={loadGeneratedAsInput}
                    copyImageToClipboard={copyImageToClipboard}
                    downloadImage={downloadImage}
                    openImageInNewTab={openImageInNewTab}
                  />
                )}

                {generationType === "coding" && (
                  <CodeGenerationTab
                    generatedCode={generatedCode}
                    setGeneratedCode={setGeneratedCode}
                    isGeneratingCode={isGeneratingCode}
                    codePrompt={codePrompt}
                    setCodePrompt={setCodePrompt}
                    handleGenerateCode={handleGenerateCode}
                    codeLanguage={codeLanguage}
                    handleLanguageChange={handleLanguageChange}
                    showSuggestions={showSuggestions}
                    setShowSuggestions={setShowSuggestions}
                    showToast={showToast}
                  />
                )}

                {generationType === "other" && <OtherGenerationTab />}
              </div>

              {/* Footer */}
              <div className="mt-8 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-white/60">
                <a
                  href="https://v0.dev/chat/template-link-here"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors flex items-center gap-1"
                >
                  Make this app your own
                </a>
                <span className="text-white/20 hidden sm:inline">•</span>
                <button
                  onClick={() => setShowHowItWorks(true)}
                  className="hover:text-white/80 transition-colors"
                >
                  How it works
                </button>
                <span className="text-white/20 hidden sm:inline">•</span>
                <a
                  href="https://x.com/estebansuarez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors flex items-center gap-1"
                >
                  Feedback?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HowItWorksModal open={showHowItWorks} onOpenChange={setShowHowItWorks} />

      <AiModelSelectorModal
        showAiModal={showAiModal}
        setShowAiModal={setShowAiModal}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        selectedAiModel={selectedAiModel}
        setSelectedAiModel={setSelectedAiModel}
        availableKeys={availableKeys}
      />

      <LanguageConversionModal
        showConversionModal={showConversionModal}
        codeLanguage={codeLanguage}
        pendingLanguage={pendingLanguage}
        cancelLanguageConversion={cancelLanguageConversion}
        confirmLanguageConversion={confirmLanguageConversion}
      />

      {showFullscreen && fullscreenImageUrl && (
        <FullscreenViewer
          imageUrl={fullscreenImageUrl}
          generations={persistedGenerations}
          onClose={closeFullscreen}
          onNavigate={handleFullscreenNavigate}
        />
      )}
    </div>
  );
};
