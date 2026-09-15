"use client";

import React, { memo, useCallback, useMemo, useRef } from "react";

import { cn } from "@/lib/utils";
import { Sparkles, Trash2, Wand2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";
import { ImageUploadBox } from "./image-upload-box";
import { Generation } from "./types";

const btnClassName =
  "w-full h-10 md:h-12 text-sm md:base font-semibold bg-white text-black hover:bg-gray-200";

const ClearIcon = (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface InputSectionProps {
  mode: "text-to-image" | "image-editing";
  setMode: (mode: "text-to-image" | "image-editing") => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  availableAspectRatios: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
  }>;
  useUrls: boolean;
  setUseUrls: (use: boolean) => void;
  image1Preview: string | null;
  image2Preview: string | null;
  image1Url: string;
  image2Url: string;
  isConvertingHeic: boolean;
  canGenerate: boolean;
  hasImages: boolean;
  onGenerate: () => void;
  onClearAll: () => void;
  onImageUpload: (file: File, slot: 1 | 2) => Promise<void>;
  onUrlChange: (url: string, slot: 1 | 2) => void;
  onClearImage: (slot: 1 | 2) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPromptPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onImageFullscreen: (url: string) => void;
  promptTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
  isAuthenticated?: boolean;
  remaining?: number;
  decrementOptimistic?: () => void;
  usageLoading?: boolean;
  onShowAuthModal?: () => void;
  generations: Generation[];
  selectedGenerationId: string | null;
  onSelectGeneration: (id: string) => void;
  onCancelGeneration: (id: string) => void;
  onDeleteGeneration: (id: string) => Promise<void>;
  historyLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

const ModeTab = memo(function ModeTab({
  currentMode,
  targetMode,
  icon: Icon,
  label,
  onClick,
}: {
  currentMode: string;
  targetMode: "text-to-image" | "image-editing";
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all text-sm font-medium",
        currentMode === targetMode
          ? "bg-white text-black shadow-lg"
          : "text-white/70 hover:text-white hover:bg-white/5",
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
});

const UrlInput = memo(function UrlInput({
  value,
  onChange,
  onClear,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 md:p-3 pr-8 bg-black/50 border border-gray-600 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white"
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {ClearIcon}
        </button>
      )}
    </div>
  );
});

const UploadTypeToggle = memo(function UploadTypeToggle({
  useUrls,
  setUseUrls,
}: {
  useUrls: boolean;
  setUseUrls: (use: boolean) => void;
}) {
  return (
    <div className="inline-flex bg-black/50 border border-gray-600">
      <button
        onClick={() => setUseUrls(false)}
        className={cn(
          "px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium",
          !useUrls ? "bg-white text-black" : "text-gray-300 hover:text-white",
        )}
      >
        Files
      </button>

      <button
        onClick={() => setUseUrls(true)}
        className={cn(
          "px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium",
          useUrls ? "bg-white text-black" : "text-gray-300 hover:text-white",
        )}
      >
        URLs
      </button>
    </div>
  );
});

const FileUploadField = memo(function FileUploadField({
  slot,
  preview,
  onImageUpload,
  onClearImage,
  onImageFullscreen,
}: {
  slot: 1 | 2;
  preview: string | null;
  onImageUpload: (file: File, slot: 1 | 2) => Promise<void>;
  onClearImage: (slot: 1 | 2) => void;
  onImageFullscreen: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSelect = useCallback(() => {
    if (preview) onImageFullscreen(preview);
    else fileRef.current?.click();
  }, [preview, onImageFullscreen]);

  return (
    <>
      <ImageUploadBox
        imageNumber={slot}
        preview={preview ?? ""}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith("image/")) {
            onImageUpload(file, slot);
          }
        }}
        onClear={() => onClearImage(slot)}
        onSelect={handleSelect}
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onImageUpload(file, slot);
            e.target.value = "";
          }
        }}
      />
    </>
  );
});

export const InputSection = memo(function InputSection({
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
  onGenerate,
  onClearAll,
  onImageUpload,
  onUrlChange,
  onClearImage,
  onKeyDown,
  onPromptPaste,
  onImageFullscreen,
  promptTextareaRef,
}: InputSectionProps) {
  const handleTextMode = useCallback(() => setMode("text-to-image"), [setMode]);

  const handleEditMode = useCallback(() => setMode("image-editing"), [setMode]);

  const aspectOptions = useMemo(
    () =>
      availableAspectRatios.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          <div className="flex items-center gap-2">
            {option.icon}
            <span>{option.label}</span>
          </div>
        </SelectItem>
      )),
    [availableAspectRatios],
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-4 flex gap-2 p-1 bg-black/30 rounded-lg border border-white/10">
        <ModeTab
          currentMode={mode}
          targetMode="text-to-image"
          icon={Sparkles}
          label="Text to Image"
          onClick={handleTextMode}
        />

        <ModeTab
          currentMode={mode}
          targetMode="image-editing"
          icon={Wand2}
          label="Image Editing"
          onClick={handleEditMode}
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <div className="flex items-center justify-between">
          <label className="text-sm md:text-base font-medium text-gray-300">
            Prompt
          </label>

          <div className="flex gap-2">
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger className="w-28 md:w-32 bg-black/50 border border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="bg-black border-gray-600 text-white">
                {aspectOptions}
              </SelectContent>
            </Select>

            <Button
              onClick={onClearAll}
              disabled={!prompt.trim() && !hasImages}
              variant="outline"
              className="border-gray-600"
            >
              <Trash2 className="size-4 md:hidden" />
              <span className="hidden md:inline">Clear</span>
            </Button>
          </div>
        </div>

        <textarea
          ref={promptTextareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPromptPaste}
          className="w-full min-h-[100px] p-4 bg-black/50 border-2 border-gray-600 focus:border-white resize-none text-white"
        />

        {mode === "image-editing" && (
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm md:text-base text-gray-300">
                Images
              </label>

              <UploadTypeToggle useUrls={useUrls} setUseUrls={setUseUrls} />
            </div>

            {useUrls ? (
              <>
                <UrlInput
                  value={image1Url}
                  onChange={(v) => onUrlChange(v, 1)}
                  onClear={() => onClearImage(1)}
                  placeholder="First image URL"
                />

                <UrlInput
                  value={image2Url}
                  onChange={(v) => onUrlChange(v, 2)}
                  onClear={() => onClearImage(2)}
                  placeholder="Second image URL"
                />
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <FileUploadField
                  slot={1}
                  preview={image1Preview}
                  onImageUpload={onImageUpload}
                  onClearImage={onClearImage}
                  onImageFullscreen={onImageFullscreen}
                />

                <FileUploadField
                  slot={2}
                  preview={image2Preview}
                  onImageUpload={onImageUpload}
                  onClearImage={onClearImage}
                  onImageFullscreen={onImageFullscreen}
                />
              </div>
            )}
          </div>
        )}

        <Button
          onClick={onGenerate}
          disabled={!canGenerate || isConvertingHeic}
          className={btnClassName}
        >
          {isConvertingHeic
            ? "Converting HEIC..."
            : mode === "text-to-image"
              ? "Generate Image"
              : "Edit Image"}
        </Button>
      </div>
    </div>
  );
});
