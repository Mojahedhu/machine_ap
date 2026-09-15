"use client";

import ErrorFallback from "@/components/ui/errorFallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-black text-white">
        <ErrorFallback
          title="Critical Error 500"
          message={error.message || "An unexpected error occurred."}
          actionLabel="Reload Application"
          onAction={() => reset()}
        />
      </body>
    </html>
  );
}
