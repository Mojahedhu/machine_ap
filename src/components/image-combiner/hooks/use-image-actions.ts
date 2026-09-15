import { useState, useCallback } from "react";
import { Generation } from "../types";

interface UseImageActionsProps {
  generatedImage: { url: string; prompt: string } | null;
  currentMode: "text-to-image" | "image-editing";
  isMobile: boolean;
  persistedGenerations: Generation[];
  setSelectedGenerationId: (id: string | null) => void;
  showToast: (message: string, type: "success" | "error" | undefined) => void;
}

export const useImageActions = ({
  generatedImage,
  currentMode,
  isMobile,
  persistedGenerations,
  setSelectedGenerationId,
  showToast,
}: UseImageActionsProps) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState("");

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const openFullscreen = useCallback(() => {
    if (generatedImage?.url) {
      setFullscreenImageUrl(generatedImage.url);
      setShowFullscreen(true);
      document.body.style.overflow = "hidden";
    }
  }, [generatedImage?.url]);

  const closeFullscreen = useCallback(() => {
    setShowFullscreen(false);
    setFullscreenImageUrl("");
    document.body.style.overflow = "unset";
  }, []);

  const handleFullscreenNavigate = useCallback(
    (direction: "prev" | "next") => {
      const completedGenerations = persistedGenerations.filter(
        (g) => g.status === "complete" && g.imageUrl,
      );
      const currentIndex = completedGenerations.findIndex(
        (g) => g.imageUrl === fullscreenImageUrl,
      );
      if (currentIndex === -1) return;

      let newIndex: number;
      if (direction === "prev") {
        newIndex =
          currentIndex === 0
            ? completedGenerations.length - 1
            : currentIndex - 1;
      } else {
        newIndex =
          currentIndex === completedGenerations.length - 1
            ? 0
            : currentIndex + 1;
      }

      setFullscreenImageUrl(completedGenerations[newIndex].imageUrl!);
      setSelectedGenerationId(completedGenerations[newIndex].id);
    },
    [persistedGenerations, fullscreenImageUrl, setSelectedGenerationId],
  );
  const downloadImage = useCallback(async () => {
    if (!generatedImage?.url) return;

    try {
      const response = await fetch(generatedImage.url);

      // 1. Explicitly check for HTTP errors (e.g., 404, 500)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      // 2. Ensuring the filename is clean
      link.download = `nano-banana-pro-${currentMode || "image"}-result.png`;

      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image via blob:", error);

      // 3. Fallback: Open in new tab, but check if it was blocked
      const newWindow = window.open(generatedImage.url, "_blank");

      if (!newWindow) {
        // If you have access to your showToast function here, use it!
        console.warn("Pop-up blocked. Could not open image fallback.");
        // showToast("Please allow pop-ups to download the image", "error");
      }
    }
  }, [generatedImage, currentMode]);
  const openImageInNewTab = useCallback(async () => {
    if (!generatedImage?.url) {
      console.error("No image URL available");
      return;
    }

    try {
      let urlToOpen = generatedImage.url;
      if (generatedImage.url.startsWith("data:")) {
        const response = await fetch(generatedImage.url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        urlToOpen = blobUrl;
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      }

      window.open(urlToOpen, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening image:", error);
      window.open(generatedImage.url, "_blank");
    }
  }, [generatedImage]);

  const copyImageToClipboard = useCallback(async () => {
    if (!generatedImage?.url) return;

    // 1. Defined helper function
    const convertToPngBlob = async (imageUrl: string): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Requires CORS headers from the image server!

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Failed to convert to blob"));
            },
            "image/png",
            1.0,
          );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageUrl;
      });
    };

    try {
      showToast("Copying image...", "success");
      window.focus(); // Good practice before clipboard ops

      // 2. The Safari Fix: Pass the Promise directly to ClipboardItem
      const blobPromise = convertToPngBlob(generatedImage.url);

      const clipboardItem = new ClipboardItem({
        "image/png": blobPromise,
      });

      await navigator.clipboard.write([clipboardItem]);
      showToast("Image copied to clipboard!", "success");
    } catch (error) {
      console.error("Clipboard write failed:", error);

      // 3. Better Mobile Fallback: Native Web Share API
      if (isMobile && navigator.share) {
        try {
          const blob = await convertToPngBlob(generatedImage.url);
          const file = new File([blob], "image.png", { type: "image/png" });

          await navigator.share({
            files: [file],
            title: "Generated Image",
          });
          // No toast needed usually, native UI handles the feedback
          return;
        } catch (shareError) {
          console.log("Share cancelled or failed:", shareError);
          // If the user just dismissed the share sheet, we don't necessarily want an error toast
        }
      }

      // 4. Standard Error Handling
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("not focused")
      ) {
        showToast(
          "Please click on the page first, then try copying again",
          "error",
        );
      } else {
        showToast(
          "Copy not supported by your browser. Use the download button instead.",
          "error",
        );
      }
    }
  }, [generatedImage, isMobile, showToast]);

  return {
    showFullscreen,
    setShowFullscreen,
    fullscreenImageUrl,
    setFullscreenImageUrl,
    openFullscreen,
    closeFullscreen,
    handleFullscreenNavigate,
    downloadImage,
    openImageInNewTab,
    copyImageToClipboard,
  };
};
