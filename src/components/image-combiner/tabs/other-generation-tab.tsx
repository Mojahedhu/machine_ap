import React from "react";
import { SvgAudioIcon, SvgVideoIcon, SvgDataIcon } from "../icons";

export const OtherGenerationTab = () => {
  return (
    <div className="space-y-6 w-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            More AI Tools
          </h2>
          <p className="text-gray-400">Choose a feature to get started</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Audio Generation - Pro */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-6 cursor-not-allowed opacity-75 text-left relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              PRO
            </div>
            <div className="w-12 h-12 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <SvgAudioIcon />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Audio Generation
            </h3>
            <p className="text-gray-500 text-sm">
              Generate AI voices, music, and sound effects
            </p>
          </div>

          {/* Video Generation - Pro */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-6 cursor-not-allowed opacity-75 text-left relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              PRO
            </div>
            <div className="w-12 h-12 mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <SvgVideoIcon />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Video Generation
            </h3>
            <p className="text-gray-500 text-sm">
              Create AI-powered videos and animations
            </p>
          </div>

          {/* Data Analysis - Pro */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-6 cursor-not-allowed opacity-75 text-left relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              PRO
            </div>
            <div className="w-12 h-12 mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <SvgDataIcon />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Data Analysis
            </h3>
            <p className="text-gray-500 text-sm">
              Analyze data with AI-powered insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
