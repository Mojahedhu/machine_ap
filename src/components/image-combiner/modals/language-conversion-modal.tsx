interface LanguageConversionModalProps {
  showConversionModal: boolean;
  codeLanguage: string;
  pendingLanguage: string | null;
  cancelLanguageConversion: () => void;
  confirmLanguageConversion: () => void;
}

export const LanguageConversionModal = ({
  showConversionModal,
  codeLanguage,
  pendingLanguage,
  cancelLanguageConversion,
  confirmLanguageConversion,
}: LanguageConversionModalProps) => {
  if (!showConversionModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={cancelLanguageConversion}
      />

      {/* Modal */}
      <div className="relative bg-linear-to-br from-gray-900 to-gray-950 border border-yellow-500/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-linear-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 animate-pulse" />

        {/* Content */}
        <div className="relative p-6 space-y-4">
          {/* Icon with animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">
              Convert Code Language?
            </h3>
            <p className="text-gray-400 text-sm">
              Transform your existing{" "}
              <span className="text-yellow-400 font-semibold">
                {codeLanguage}
              </span>{" "}
              code to{" "}
              <span className="text-orange-400 font-semibold">
                {pendingLanguage}
              </span>
            </p>
          </div>

          {/* Info box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-400 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-blue-300 text-xs">
                AI will intelligently convert your code while preserving
                functionality and applying language-specific best practices.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={cancelLanguageConversion}
              className="flex-1 px-4 py-2.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={confirmLanguageConversion}
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-semibold shadow-lg shadow-yellow-500/30 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Convert Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
