"use client";

import ErrorFallback from "@/components/ui/errorFallback";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const pathName = usePathname();
  useEffect(() => {
    console.error("Root segment error:", error);
  }, [error]);

  useEffect(() => {
    if (pathName) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <ErrorFallback
      title="Something went wrong 500"
      message={error.message || "An unexpected error occurred."}
      actionLabel="Try Again"
      onAction={() => reset()}
    />
  );
}
