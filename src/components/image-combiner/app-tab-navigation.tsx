import {
  SvgTextIcon,
  SvgImageIcon,
  SvgCodingIcon,
  SvgOtherIcon,
} from "./icons";

type GenerationType = "text" | "image" | "coding" | "other";

interface AppTabNavigationProps {
  generationType: GenerationType;
  setGenerationType: (type: GenerationType) => void;
}

export const AppTabNavigation = ({
  generationType,
  setGenerationType,
}: AppTabNavigationProps) => {
  return (
    <div className="bg-black/70 backdrop-blur-sm border-b border-white/30 px-4 py-3 md:px-6 md:py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 p-1.5 bg-black/50 rounded-xl border border-white/30">
          <button
            onClick={() => setGenerationType("text")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 md:py-3.5 rounded-lg transition-all text-xs md:text-base font-semibold ${
              generationType === "text"
                ? "bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <SvgTextIcon />
            <span className="hidden sm:inline">Text</span>
          </button>
          <button
            onClick={() => setGenerationType("image")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 md:py-3.5 rounded-lg transition-all text-xs md:text-base font-semibold ${
              generationType === "image"
                ? "bg-linear-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <SvgImageIcon />
            <span className="hidden sm:inline">Image</span>
          </button>
          <button
            onClick={() => setGenerationType("coding")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 md:py-3.5 rounded-lg transition-all text-xs md:text-base font-semibold ${
              generationType === "coding"
                ? "bg-linear-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <SvgCodingIcon />
            <span className="hidden sm:inline">Coding</span>
          </button>
          <button
            onClick={() => setGenerationType("other")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 md:py-3.5 rounded-lg transition-all text-xs md:text-base font-semibold ${
              generationType === "other"
                ? "bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <SvgOtherIcon />
            <span className="hidden sm:inline">Other</span>
          </button>
        </div>
      </div>
    </div>
  );
};
