import { useState, useCallback, useEffect } from "react";

interface UseDragDropProps {
  setUseUrls: (useUrls: boolean) => void;
  handleImageUpload: (file: File, slot: 1 | 2) => Promise<void>;
  showToast: (message: string, type: "success" | "error" | undefined) => void;
}

export const useDragDrop = ({
  setUseUrls,
  handleImageUpload,
  showToast,
}: UseDragDropProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [, setDragCounter] = useState(0);
  const [dropZoneHover, setDropZoneHover] = useState<1 | 2 | null>(null);

  const handleGlobalDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragCounter((prev) => prev + 1);
    const items = e.dataTransfer?.items;
    if (!items) {
      return;
    }
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
        setIsDraggingOver(true);
        break;
      }
    }
  }, []);

  const handleGlobalDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();

    if (!e.dataTransfer) return;

    const hasFiles = Array.from(e.dataTransfer.types).includes("Files");

    if (hasFiles) {
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleGlobalDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragCounter((prev) => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        setIsDraggingOver(false);
        return 0;
      }
      return newCount;
    });
  }, []);

  const handleGlobalDrop = useCallback(
    async (e: DragEvent | React.DragEvent, slot?: 1 | 2) => {
      e.preventDefault();
      setIsDraggingOver(false);
      setDragCounter(0);
      setDropZoneHover(null);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          setUseUrls(false);
          const targetSlot = slot || 1;
          await handleImageUpload(file, targetSlot);
          showToast(
            `Image dropped to ${targetSlot === 1 ? "first" : "second"} slot`,
            "success",
          );
        }
      }
    },
    [handleImageUpload, setUseUrls, showToast],
  );

  useEffect(() => {
    document.addEventListener("dragover", handleGlobalDragOver);
    document.addEventListener("dragleave", handleGlobalDragLeave);
    document.addEventListener("dragenter", handleGlobalDragEnter);
    return () => {
      document.removeEventListener("dragover", handleGlobalDragOver);
      document.removeEventListener("dragleave", handleGlobalDragLeave);
      document.removeEventListener("dragenter", handleGlobalDragEnter);
    };
  }, [handleGlobalDragOver, handleGlobalDragLeave, handleGlobalDragEnter]);

  return {
    isDraggingOver,
    dropZoneHover,
    setDropZoneHover,
    handleGlobalDrop,
  };
};
