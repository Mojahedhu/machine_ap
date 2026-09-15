import { useState } from "react";
import { detectLanguage } from "@/lib/helper";

interface UseCodeGenerationProps {
  selectedAiModel: string;
}

export const useCodeGeneration = ({
  selectedAiModel,
}: UseCodeGenerationProps) => {
  const [codePrompt, setCodePrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("javascript");
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle code generation
  const handleGenerateCode = async (targetLanguage?: string) => {
    if (!codePrompt.trim() || isGeneratingCode) return;

    setIsGeneratingCode(true);

    try {
      const languageInstruction = targetLanguage ? ` in ${targetLanguage}` : "";
      const fullPrompt =
        targetLanguage && generatedCode
          ? `Convert this code to ${targetLanguage}:\n\n${generatedCode}`
          : codePrompt;

      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullPrompt + languageInstruction,
          language: targetLanguage,
          aiModel: selectedAiModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate code");
      }

      const data = await response.json();
      setGeneratedCode(data.code);
      // Auto-detect language or use target language
      if (targetLanguage) {
        setCodeLanguage(targetLanguage);
      } else {
        const detectedLang = detectLanguage(data.code);
        setCodeLanguage(detectedLang);
      }
    } catch (error) {
      console.error("Code generation error:", error);
      alert(error instanceof Error ? error.message : "Failed to generate code");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    const oldLanguage = codeLanguage;

    // If we have existing code, show conversion modal
    if (generatedCode && oldLanguage !== newLanguage) {
      setPendingLanguage(newLanguage);
      setShowConversionModal(true);
    } else {
      setCodeLanguage(newLanguage);
    }
  };

  const confirmLanguageConversion = () => {
    if (pendingLanguage) {
      setCodeLanguage(pendingLanguage);
      setShowConversionModal(false);
      handleGenerateCode(pendingLanguage);
      setPendingLanguage(null);
    }
  };

  const cancelLanguageConversion = () => {
    setShowConversionModal(false);
    setPendingLanguage(null);
  };

  return {
    codePrompt,
    setCodePrompt,
    generatedCode,
    setGeneratedCode,
    isGeneratingCode,
    codeLanguage,
    setCodeLanguage,
    showConversionModal,
    setShowConversionModal,
    pendingLanguage,
    showSuggestions,
    setShowSuggestions,
    handleGenerateCode,
    handleLanguageChange,
    confirmLanguageConversion,
    cancelLanguageConversion,
  };
};
