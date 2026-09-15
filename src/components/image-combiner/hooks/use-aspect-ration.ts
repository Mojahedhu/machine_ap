import { useState } from "react";
import { ALL_ASPECT_RATIOS, DEFAULT_ASPECT_RATIOS } from "../constants";
import { AspectRatioOption } from "../types";

export const useAspectRation = () => {
  const [aspectRatio, setAspectRatio] = useState<string>("square");
  const [availableAspectRatios, setAvailableAspectRatios] = useState<
    AspectRatioOption[]
  >(DEFAULT_ASPECT_RATIOS);

  const detectAspectRatio = (width: number, height: number) => {
    const ratio = width / height;
    const defaultOption = ["square", "portrait", "landscape", "wide"];

    let closestMatch = ALL_ASPECT_RATIOS[0];
    let smallestDiff = Math.abs(ratio - closestMatch.ratio);

    for (const option of ALL_ASPECT_RATIOS) {
      const diff = Math.abs(ratio - option.ratio);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestMatch = option;
      }
    }

    if (!defaultOption.includes(closestMatch.value)) {
      setAvailableAspectRatios((prev) => {
        const exists = prev.some(
          (option) => option.value === closestMatch.value,
        );
        if (!exists) {
          return [...prev, closestMatch].sort((a, b) => a.ratio - b.ratio);
        }
        return prev;
      });
    }

    return closestMatch.value;
  };
  return {
    aspectRatio,
    setAspectRatio,
    availableAspectRatios,
    detectAspectRatio,
  };
};
