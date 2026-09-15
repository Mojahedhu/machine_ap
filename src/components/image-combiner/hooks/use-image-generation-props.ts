import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Generation } from "../types";

interface UseImageGenerationProps {
  prompt: string;
  aspectRatio: string;
  image1: File | null;
  image2: File | null;
  image1Url: string;
  image2Url: string;
  useUrls: boolean;
  aiModel: string;
  generations: Generation[];
  setGenerations: React.Dispatch<React.SetStateAction<Generation[]>>;
  addGeneration: (generation: Generation) => Promise<void>;
  onToast: (message: string, type?: "success" | "error") => void;
  onImageUpload: (file: File, imageNumber: 1 | 2) => Promise<void>;
  onApiKeyMissing?: () => void;
}

interface GenerateImageOptions {
  prompt?: string;
  aspectRatio?: string;
  image1?: File | null;
  image2?: File | null;
  image1Url?: string;
  image2Url?: string;
  useUrls?: boolean;
}

export const playSuccessSound = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(
      660,
      audioContext.currentTime + 0.2,
    );

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Close the audio context when finished to prevent memory leaks
    oscillator.onended = () => {
      audioContext.close().catch(console.error);
    };
  } catch (error) {
    console.error("Error playing success sound:", error);
  }
};

export const useImageGeneration = (props: UseImageGenerationProps) => {
  const [selectedGenerationId, setSelectedGenerationId] = useState<
    string | null
  >(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use a single ref to hold all the latest props and state to avoid stale closures
  const stateRef = useRef({ ...props, selectedGenerationId });

  // Update ref on every render so callbacks always have the freshest data
  useEffect(() => {
    stateRef.current = { ...props, selectedGenerationId };
  });

  const cancelGeneration = useCallback(
    (generationId: string) => {
      props.setGenerations((prev) => {
        const generation = prev.find((g) => g.id === generationId);
        if (generation?.abortController) {
          generation.abortController.abort();
        }
        return prev.map((gen) =>
          gen.id === generationId && gen.status === "loading"
            ? {
                ...gen,
                status: "error" as const,
                error: "Generation cancelled by user",
                progress: 0,
                abortController: undefined,
              }
            : gen,
        );
      });
      stateRef.current.onToast("Generation cancelled", "error");
    },
    [props.setGenerations],
  );

  const generateImage = useCallback(
    async (options?: GenerateImageOptions) => {
      const refs = stateRef.current;
      const effectivePrompt = options?.prompt ?? refs.prompt;
      const effectiveAspectRatio = options?.aspectRatio ?? refs.aspectRatio;
      const effectiveImage1 = options?.image1 ?? refs.image1;
      const effectiveImage2 = options?.image2 ?? refs.image2;
      const effectiveImage1Url = options?.image1Url ?? refs.image1Url;
      const effectiveImage2Url = options?.image2Url ?? refs.image2Url;
      const effectiveUseUrls = options?.useUrls ?? refs.useUrls;

      const hasImage = effectiveUseUrls
        ? effectiveImage1Url || effectiveImage2Url
        : effectiveImage1 || effectiveImage2;

      const currentMode = hasImage ? "image-editing" : "text-to-image";

      if (
        currentMode === "image-editing" &&
        !effectiveUseUrls &&
        !effectiveImage1
      ) {
        refs.onToast(
          "Please upload at least one image for editing mode",
          "error",
        );
        return;
      }

      if (
        currentMode === "image-editing" &&
        effectiveUseUrls &&
        !effectiveImage1Url
      ) {
        refs.onToast(
          "Please upload at least one URL image for editing mode",
          "error",
        );
        return;
      }

      if (!effectivePrompt.trim()) {
        refs.onToast("Please enter a prompt", "error");
        return;
      }

      const numOfVariations = 1;
      const generationPromises = [];

      for (let i = 0; i < numOfVariations; i++) {
        const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const controller = new AbortController();

        const newGeneration: Generation = {
          id: generationId,
          status: "loading",
          progress: 0,
          imageUrl: null,
          prompt: effectivePrompt,
          timestamp: Date.now() + i,
          abortController: controller,
        };

        refs.setGenerations((prev) => [...prev, newGeneration]);

        if (i === 0) {
          setSelectedGenerationId(generationId);
        }

        const progressInterval = setInterval(() => {
          refs.setGenerations((prev) =>
            prev.map((gen) => {
              if (gen.id === generationId && gen.status === "loading") {
                let next;
                if (gen.progress >= 98) next = 98;
                else if (gen.progress >= 96) next = gen.progress + 0.2;
                else if (gen.progress >= 90) next = gen.progress + 0.5;
                else if (gen.progress >= 75) next = gen.progress + 0.8;
                else if (gen.progress >= 50) next = gen.progress + 1;
                else if (gen.progress >= 25) next = gen.progress + 1.2;
                else next = gen.progress + 1.5;

                return { ...gen, progress: Math.min(98, next) };
              }
              return gen;
            }),
          );
        }, 100);

        const generationPromise = (async () => {
          try {
            const formData = new FormData();
            formData.append("mode", currentMode);
            formData.append("prompt", effectivePrompt);
            formData.append("aspectRatio", effectiveAspectRatio);
            formData.append("aiModel", refs.aiModel);

            if (currentMode === "image-editing") {
              if (effectiveUseUrls) {
                formData.append("image1Url", effectiveImage1Url);
                if (effectiveImage2Url) {
                  formData.append("image2Url", effectiveImage2Url);
                }
              } else {
                if (effectiveImage1) formData.append("image1", effectiveImage1);
                if (effectiveImage2) formData.append("image2", effectiveImage2);
              }
            }

            const response = await fetch("/api/generate-image", {
              method: "POST",
              body: formData,
              signal: controller.signal,
            });

            if (!response.ok) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              let errorData: any = {};
              try {
                errorData = await response.json();
              } catch {
                errorData = { error: "Unknown error" };
              }

              // Fixed conditional logic: object properties, not string comparison
              if (
                errorData?.error === "configuration error" &&
                errorData?.details?.includes("AI_GATWAY_API_KEY")
              ) {
                refs.setGenerations((prev) =>
                  prev.filter((gen) => gen.id !== generationId),
                );
                refs.onApiKeyMissing?.();
                return;
              }

              throw new Error(
                `${errorData.error || "Generation failed"}${
                  errorData.details ? `: ${errorData.details}` : ""
                }`,
              );
            }

            const data = await response.json();

            if (data.url) {
              const completedGeneration: Generation = {
                id: generationId,
                status: "complete",
                progress: 100,
                imageUrl: data.url,
                prompt: effectivePrompt,
                timestamp: Date.now(),
                createdAt: new Date().toISOString(),
                aspectRatio: effectiveAspectRatio,
                mode: currentMode,
              };

              refs.setGenerations((prev) =>
                prev.filter((gen) => gen.id !== generationId),
              );
              await refs.addGeneration(completedGeneration);

              if (stateRef.current.selectedGenerationId === generationId) {
                setImageLoaded(true);
              }
              playSuccessSound();
            }
          } catch (error) {
            console.error("Error in generation", error);

            if (error instanceof Error && error.name === "AbortError") {
              return; // Expected abort, do nothing further
            }

            const errorMessage =
              error instanceof Error ? error.message : "Unknown error occurred";

            refs.setGenerations((prev) =>
              prev.filter((gen) => gen.id !== generationId),
            );
            refs.onToast(`Error generating image: ${errorMessage}`, "error");
          } finally {
            // Guarantee the interval clears, even if a network error or abort throws early
            clearInterval(progressInterval);
          }
        })();

        generationPromises.push(generationPromise);
      }

      await Promise.all(generationPromises);
    },
    [], // Dependencies removed since we rely safely on stateRef
  );

  const loadGeneratedAsInput = useCallback(async () => {
    const refs = stateRef.current;
    const selectedGeneration = refs.generations.find(
      (g) => g.id === refs.selectedGenerationId,
    );

    if (!selectedGeneration?.imageUrl) return;

    try {
      const response = await fetch(selectedGeneration.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "generated-image.png", {
        type: "image/png",
      });

      await refs.onImageUpload(file, 1);
      refs.onToast("Image loaded into Input 1", "success");
    } catch (error) {
      console.error("Error loading image as input:", error);
      refs.onToast("Error loading image", "error");
    }
  }, []);

  return useMemo(
    () => ({
      selectedGenerationId,
      setSelectedGenerationId,
      imageLoaded,
      setImageLoaded,
      generateImage,
      cancelGeneration,
      loadGeneratedAsInput,
    }),
    [
      selectedGenerationId,
      imageLoaded,
      generateImage,
      cancelGeneration,
      loadGeneratedAsInput,
    ],
  );
};
