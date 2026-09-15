import { useState, memo, useCallback, useMemo } from "react";
import { Generation } from "./types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface GenerationHistoryProps {
  generations: Generation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  className?: string;
  compact?: boolean; // Added compact prop
}

export const CloseIcon = (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const ErrorIcon = (
  <svg
    className="w-6 h-6 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface GenerationItemProps {
  gen: Generation;
  index: number;
  isSelected?: boolean;
  isDeleting?: boolean;
  onSelect: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete?: (e: React.MouseEvent, id: string) => Promise<void>;
}

const LoadingGeneration = memo(
  ({ gen, onCancel }: { gen: Generation; onCancel: (id: string) => void }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-sm md:text-base text-white/90 font-mono font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {Math.round(gen.progress)}%
      </span>
      {/* Progress Bar */}
      <div className="mt-2 w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full progress-pattern transition-[width] duration-300"
          style={{
            width: `${gen.progress}%`,
          }}
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCancel(gen.id);
        }}
        className="mt-2 text-[10px] px-2 py-0.5 bg-white/10 hover:bg-white text-white hover:text-black transition-all"
        aria-label="Cancel generation"
      >
        Cancel
      </button>
    </div>
  ),
);
LoadingGeneration.displayName = "LoadingGeneration";

const DeleteButton = memo(
  ({
    genId,
    isDeleting = false,
    onDelete,
    alwaysVisible = false,
  }: {
    genId: string;
    isDeleting?: boolean;
    onDelete: (e: React.MouseEvent, id: string) => Promise<void>;
    alwaysVisible?: boolean;
  }) => (
    <button
      onClick={(e) => onDelete(e, genId)}
      disabled={isDeleting}
      className={cn(
        "absolute top-1 right-1 p-1 bg-black/70 hover:bg-white text-white hover:text-black transition-all disabled:opacity-50 z-10",
        alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100",
      )}
      aria-label="Delete generation"
    >
      {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : CloseIcon}
    </button>
  ),
);
DeleteButton.displayName = "DeleteButton";

const ErrorGeneration = memo(
  ({
    gen,
    isDeleting = false,
    onDelete,
  }: {
    gen: Generation;
    isDeleting?: boolean;
    onDelete?: (e: React.MouseEvent, id: string) => Promise<void>;
  }) => (
    <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
      {ErrorIcon}
      <span className="sr-only">Generation failed</span>
      {onDelete && (
        <DeleteButton
          genId={gen.id}
          isDeleting={isDeleting}
          onDelete={onDelete}
          alwaysVisible
        />
      )}
    </div>
  ),
);
ErrorGeneration.displayName = "ErrorGeneration";

const SuccessGeneration = memo(
  ({
    gen,
    isLoaded,
    setIsLoaded,
    isDeleting = false,
    onDelete,
  }: {
    gen: Generation;
    isLoaded: boolean;
    setIsLoaded: (loaded: boolean) => void;
    isDeleting?: boolean;
    onDelete?: (e: React.MouseEvent, id: string) => Promise<void>;
  }) => (
    <>
      {onDelete && (
        <DeleteButton
          genId={gen.id}
          isDeleting={isDeleting}
          onDelete={onDelete}
        />
      )}
      <Image
        src={gen.imageUrl || "/placeholder.svg"}
        alt={gen.prompt || "Generated image"}
        fill
        sizes="(max-width: 768px) 80px, 96px"
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setIsLoaded(true)}
        unoptimized={gen.imageUrl?.includes("blob:") ?? false}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
    </>
  ),
);
SuccessGeneration.displayName = "SuccessGeneration";

const GenerationItem = memo(
  ({
    gen,
    index,
    isSelected = false,
    isDeleting = false,
    onSelect,
    onCancel,
    onDelete,
  }: GenerationItemProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
      <div
        onClick={() => onSelect(gen.id)}
        className={cn(
          "relative shrink-0 w-18 h-18 md:w-24 md:h-24 overflow-hidden transition-all cursor-pointer group",
          isSelected
            ? "border-2 border-white opacity-100"
            : "border border-gray-600 hover:border-gray-500 opacity-60 hover:opacity-100",
          index === 0 &&
            "animate-in fade-in-0 slide-in-from-left-4 duration-500",
          isDeleting && "opacity-50 pointer-events-none",
        )}
        role="button"
        tabIndex={0}
        aria-label={`Generation ${index + 1}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(gen.id);
          }
        }}
      >
        {gen.status === "loading" ? (
          <LoadingGeneration gen={gen} onCancel={onCancel} />
        ) : gen.status === "error" ? (
          <ErrorGeneration
            gen={gen}
            isDeleting={isDeleting}
            onDelete={onDelete}
          />
        ) : (
          <SuccessGeneration
            gen={gen}
            isLoaded={isLoaded}
            setIsLoaded={setIsLoaded}
            isDeleting={isDeleting}
            onDelete={onDelete}
          />
        )}
      </div>
    );
  },
);
GenerationItem.displayName = "GenerationItem";

const LoadMoreButton = memo(
  ({
    onLoadMore,
    isLoadingMore,
  }: {
    onLoadMore: () => void;
    isLoadingMore: boolean;
  }) => (
    <button
      onClick={onLoadMore}
      disabled={isLoadingMore}
      className="shrink-0 w-18 h-18 md:w-24 md:h-24 border border-gray-600 hover:border-white bg-black/30 hover:bg-black/50 transition-all flex items-center justify-center text-xs text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Load more generations"
    >
      {isLoadingMore ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <span className="font-medium">
          Load
          <br />
          More
        </span>
      )}
    </button>
  ),
);
LoadMoreButton.displayName = "LoadMoreButton";

export const GenerationHistory = memo(
  ({
    generations,
    selectedId,
    onSelect,
    onCancel,
    onDelete,
    isLoading = false,
    hasMore = false,
    onLoadMore,
    isLoadingMore = false,
    className,
    compact = false,
  }: GenerationHistoryProps) => {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = useCallback(
      async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        if (!onDelete) return;

        setDeletingId(id);
        try {
          await onDelete(id);
        } catch (error) {
          console.error("Failed to delete generation:", error);
        } finally {
          setDeletingId(null);
        }
      },
      [onDelete],
    );

    const generationItems = useMemo(() => {
      return generations.map((gen, index) => (
        <GenerationItem
          key={gen.id}
          gen={gen}
          index={index}
          isSelected={selectedId === gen.id}
          isDeleting={deletingId === gen.id}
          onSelect={onSelect}
          onCancel={onCancel}
          onDelete={onDelete ? handleDelete : undefined}
        />
      ));
    }, [
      generations,
      selectedId,
      deletingId,
      onSelect,
      onCancel,
      onDelete,
      handleDelete,
    ]);

    return (
      <div className={cn("flex flex-col w-full", className)}>
        {!compact && (
          <h4 className="text-xs md:text-sm font-medium text-gray-400 mb-1">
            History
          </h4>
        )}
        <div
          className={cn(
            "w-full flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent h-20 md:h-28 items-end",
            compact ? "pb-1" : "pb-2",
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-20 md:h-28 text-gray-400">
              <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
            </div>
          ) : generations.length === 0 ? (
            <div className="flex items-center justify-center w-full h-20 md:h-28 text-gray-500 text-xs md:text-sm">
              No generations yet
            </div>
          ) : (
            <>
              {generationItems}
              {hasMore && onLoadMore && (
                <LoadMoreButton
                  onLoadMore={onLoadMore}
                  isLoadingMore={isLoadingMore}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  },
);
GenerationHistory.displayName = "GenerationHistory";

/* 
It handles 7 UI states:

History loading

No history

Generation loading

Generation complete

Generation error

Deleting

Pagination loading

*/
