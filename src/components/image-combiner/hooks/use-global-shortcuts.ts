import { useEffect, useCallback } from "react";
import { Generation } from "../types";

interface UseGlobalShortcutsProps {
  canGenerate: boolean;
  runGeneration: () => void;
  generatedImage: { url: string; prompt: string } | null;
  copyImageToClipboard: () => void;
  downloadImage: () => void;
  loadGeneratedAsInput: () => void;
  showFullscreen: boolean;
  closeFullscreen: () => void;
  persistedGenerations: Generation[];
  fullscreenImageUrl: string;
  setFullscreenImageUrl: (url: string) => void;
  setSelectedGenerationId: (id: string | null) => void;
  image1: File | null;
  image2: File | null;
  image1Url: string;
  image2Url: string;
  handleImageUpload: (file: File, slot: 1 | 2) => Promise<void>;
  handleUrlChange: (url: string, slot: 1 | 2) => void;
  useUrls: boolean;
  setUseUrls: (use: boolean) => void;
  showToast: (message: string, type: "success" | "error" | undefined) => void;
}

export const useGlobalShortcuts = ({
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
  setFullscreenImageUrl,
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
}: UseGlobalShortcutsProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (canGenerate) {
          runGeneration();
        }
      }
    },
    [canGenerate, runGeneration],
  );

  const handleGlobalKeyboard = useCallback(
    (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.tagName === "INPUT";

      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === "c" &&
        generatedImage &&
        !e.shiftKey
      ) {
        if (!isTyping) {
          e.preventDefault();
          copyImageToClipboard();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d" && generatedImage) {
        if (!isTyping) {
          e.preventDefault();
          downloadImage();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "u" && generatedImage) {
        if (!isTyping) {
          e.preventDefault();
          loadGeneratedAsInput();
        }
      }
      if (e.key === "Escape" && showFullscreen) {
        closeFullscreen();
      }
      if (
        showFullscreen &&
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        !isTyping
      ) {
        e.preventDefault();
        const completedGenerations = persistedGenerations.filter(
          (g) => g.status === "complete" && g.imageUrl,
        );
        if (completedGenerations.length <= 1) return;

        const currentIndex = completedGenerations.findIndex(
          (g) => g.imageUrl === fullscreenImageUrl,
        );
        if (currentIndex === -1) return;

        if (e.key === "ArrowLeft") {
          const prevIndex =
            currentIndex === 0
              ? completedGenerations.length - 1
              : currentIndex - 1;
          setFullscreenImageUrl(completedGenerations[prevIndex].imageUrl!);
          setSelectedGenerationId(completedGenerations[prevIndex].id);
        } else if (e.key === "ArrowRight") {
          const nextIndex =
            currentIndex === completedGenerations.length - 1
              ? 0
              : currentIndex + 1;
          setFullscreenImageUrl(completedGenerations[nextIndex].imageUrl!);
          setSelectedGenerationId(completedGenerations[nextIndex].id);
        }
      }
    },
    [
      generatedImage,
      showFullscreen,
      copyImageToClipboard,
      downloadImage,
      loadGeneratedAsInput,
      closeFullscreen,
      persistedGenerations,
      fullscreenImageUrl,
      setFullscreenImageUrl,
      setSelectedGenerationId,
    ],
  );

  const handleGlobalPaste = useCallback(
    async (e: ClipboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const getTargetSlot = () => {
        if (!image1) return 1;
        if (!image2) return 2;
        return 1;
      };

      const getTargetUrlSlot = () => {
        if (!image1Url) return 1;
        if (!image2Url) return 2;
        return 1;
      };

      const items = e.clipboardData?.items;

      if (items) {
        for (const item of items) {
          if (!item.type.startsWith("image/")) continue;

          e.preventDefault();

          const file = item.getAsFile();
          if (!file) return;

          const slot = getTargetSlot();
          setUseUrls(false);

          await handleImageUpload(file, slot);

          const message =
            slot === 1 && !image1
              ? "Image pasted successfully"
              : slot === 2
                ? "Image pasted to second slot"
                : "Image replaced first slot";

          showToast(message, "success");
          return;
        }

        const pastedText = e.clipboardData?.getData("text");
        if (!pastedText) return;

        const urlMatch = pastedText.match(/https?:\/\/[^\s]+/i);
        if (!urlMatch) return;

        const url = urlMatch[0];

        const isImageUrl =
          /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url) ||
          /format=(jpg|jpeg|png|gif|webp)/i.test(url) ||
          url.includes("/media/") ||
          url.includes("/images/");

        if (!isImageUrl) return;

        e.preventDefault();

        const slot = getTargetUrlSlot();
        setUseUrls(true);

        setTimeout(() => {
          handleUrlChange(url, slot);
          showToast(
            `Image URL pasted to ${slot === 1 ? "first" : "second"} slot`,
            "success",
          );
        }, 150);
      }
    },
    [
      image1,
      image2,
      image1Url,
      image2Url,
      handleImageUpload,
      handleUrlChange,
      setUseUrls,
      showToast,
    ],
  );

  const handlePromptPaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pastedText = e.clipboardData.getData("text");

      const urlPattern = /https?:\/\/[^\s]+/i;
      const imagePattern =
        /\.(jpg|jpeg|png|gif|webp|bmp|svg)|format=(jpg|jpeg|png|gif|webp)/i;

      const match = pastedText.match(urlPattern);

      if (match) {
        const url = match[0];
        if (
          imagePattern.test(url) ||
          url.includes("/media/") ||
          url.includes("/images/")
        ) {
          e.preventDefault();

          if (!useUrls) {
            setUseUrls(true);
          }

          if (!image1Url) {
            handleUrlChange(url, 1);
            showToast("Image URL loaded into first slot", "success");
          } else if (!image2Url) {
            handleUrlChange(url, 2);
            showToast("Image URL loaded into second slot", "success");
          } else {
            handleUrlChange(url, 1);
            showToast("Image URL replaced first slot", "success");
          }
        }
      }
    },
    [useUrls, setUseUrls, image1Url, image2Url, handleUrlChange, showToast],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyboard);
    document.addEventListener("paste", handleGlobalPaste);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyboard);
      document.removeEventListener("paste", handleGlobalPaste);
    };
  }, [handleGlobalKeyboard, handleGlobalPaste]);

  return {
    handleKeyDown,
    handlePromptPaste,
  };
};
