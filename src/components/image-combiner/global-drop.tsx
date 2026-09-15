"use client";

import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface DropZoneItemProps {
  slotId: 1 | 2;
  isHovered: boolean;
  onDragEnter: (slotId: 1 | 2) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, slotId: 1 | 2) => void;
}

const DropZoneItem = memo(
  ({
    slotId,
    isHovered,
    onDragEnter,
    onDragLeave,
    onDrop,
  }: DropZoneItemProps) => {
    const handleDragEnter = useCallback(() => {
      onDragEnter(slotId);
    }, [onDragEnter, slotId]);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(e, slotId);
      },
      [onDrop, slotId],
    );

    return (
      <div
        className={cn(
          "flex-1 max-w-md h-64 border-4 border-dashed p-8 text-center transition-all duration-200 cursor-pointer",
          isHovered
            ? "border-white bg-white/30 scale-110 shadow-2xl shadow-white/50"
            : "border-white/50 bg-white/5 hover:bg-white/10 hover:border-white/70",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div
            className={cn(
              "w-16 h-16 flex items-center justify-center mb-4 transition-all",
              isHovered ? "bg-white/40 scale-110" : "bg-white/10",
            )}
          >
            <span
              className={cn(
                "text-3xl font-bold transition-all",
                isHovered ? "text-white" : "text-white/80",
              )}
            >
              {slotId}
            </span>
          </div>
          <svg
            className={cn(
              "w-12 h-12 mx-auto mb-4 transition-all",
              isHovered ? "text-white scale-110" : "text-white/80",
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p
            className={cn(
              "text-xl font-bold transition-all",
              isHovered ? "text-white" : "text-white/80",
            )}
          >
            Input {slotId}
          </p>
          <p
            className={cn(
              "text-sm mt-2 transition-all",
              isHovered ? "text-white/90" : "text-white/70",
            )}
          >
            Drop here for {slotId === 1 ? "first" : "second"} image
          </p>
        </div>
      </div>
    );
  },
);
DropZoneItem.displayName = "DropZoneItem";

interface GlobalDropZoneProps {
  dropZoneHover: 1 | 2 | null;
  onSetDropZoneHover: (zone: 1 | 2 | null) => void;
  onDrop: (e: React.DragEvent, slot?: 1 | 2) => void;
}

export const GlobalDropZone = memo(
  ({ dropZoneHover, onSetDropZoneHover, onDrop }: GlobalDropZoneProps) => {
    const handleDragLeave = useCallback(() => {
      onSetDropZoneHover(null);
    }, [onSetDropZoneHover]);

    const handleGlobalDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        onDrop(e, 1);
      },
      [onDrop],
    );

    return (
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center gap-8 px-8"
        onDrop={handleGlobalDrop}
      >
        <DropZoneItem
          slotId={1}
          isHovered={dropZoneHover === 1}
          onDragEnter={onSetDropZoneHover}
          onDragLeave={handleDragLeave}
          onDrop={onDrop}
        />
        <DropZoneItem
          slotId={2}
          isHovered={dropZoneHover === 2}
          onDragEnter={onSetDropZoneHover}
          onDragLeave={handleDragLeave}
          onDrop={onDrop}
        />
      </div>
    );
  },
);
GlobalDropZone.displayName = "GlobalDropZone";
