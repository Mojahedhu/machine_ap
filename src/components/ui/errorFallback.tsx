"use client";

export default function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  actionLabel = "Try Again",
  onAction,
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl font-bold tracking-tight text-red-500">⚠️</div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">{message}</p>
        {onAction && (
          <button
            onClick={onAction}
            className="w-full py-2.5 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-colors duration-200"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
