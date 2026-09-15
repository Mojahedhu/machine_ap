"use client";

export default function LoadingFallback({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-neutral-700 border-t-white rounded-full animate-spin" />
        <p className="text-neutral-400 text-sm">{message}</p>
      </div>
    </div>
  );
}
