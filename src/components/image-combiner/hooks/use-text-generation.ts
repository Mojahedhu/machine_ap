import { useState, useRef, useEffect } from "react";

interface UseTextGenerationProps {
  selectedAiModel: string;
  showToast: (message: string, type: "success" | "error" | undefined) => void;
}

export const useTextGeneration = ({
  selectedAiModel,
  showToast,
}: UseTextGenerationProps) => {
  const [textPrompt, setTextPrompt] = useState("");
  const [textConversations, setTextConversations] = useState<
    Array<{
      id: string;
      prompt: string;
      response: string;
      timestamp: number;
    }>
  >([]);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle text generation
  const handleGenerateText = async () => {
    if (!textPrompt.trim() || isGeneratingText) return;

    const conversationId = Date.now().toString();
    const userMessage = textPrompt;

    // Clear input and show user message immediately
    setTextPrompt("");
    setIsGeneratingText(true);

    // Scroll to bottom after adding user message
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          aiModel: selectedAiModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate text");
      }

      const data = await response.json();

      setTextConversations((prev) => [
        ...prev,
        {
          id: conversationId,
          prompt: userMessage,
          response: data.text,
          timestamp: Date.now(),
        },
      ]);

      // Scroll to bottom after adding AI response
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.error("Text generation error:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to generate text",
        "error",
      );
    } finally {
      setIsGeneratingText(false);
    }
  };

  // Auto-scroll when text conversations or loading state changes
  useEffect(() => {
    if (
      chatContainerRef.current &&
      (textConversations.length > 0 || isGeneratingText)
    ) {
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [textConversations, isGeneratingText]);

  return {
    textPrompt,
    setTextPrompt,
    textConversations,
    setTextConversations,
    isGeneratingText,
    chatContainerRef,
    handleGenerateText,
  };
};
