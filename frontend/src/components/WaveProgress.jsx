import React from "react";
import { useTranslation } from "react-i18next";

const WaveProgress = React.memo(
  ({ label, value, unit, percentage, color = "cyan", delay = 0 }) => {
    const { t } = useTranslation();
    // Clamp percentage between 0 and 100
    const p = Math.min(100, Math.max(0, percentage));

    // Advanced Color Palettes (Cyberpunk/Sci-Fi Themed) - High Contrast & Visibility
    const colorMap = {
      cyan: {
        text: "text-cyan-300",
        wave: "text-cyan-400",
        bg: "bg-cyan-600",
        border: "border-cyan-500/50",
        glow: "shadow-[0_0_20px_rgba(6,182,212,0.2)]",
        subText: "text-cyan-200",
      },
      blue: {
        text: "text-blue-300",
        wave: "text-blue-400",
        bg: "bg-blue-600",
        border: "border-blue-500/50",
        glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
        subText: "text-blue-200",
      },
      purple: {
        text: "text-purple-300",
        wave: "text-purple-400",
        bg: "bg-purple-600",
        border: "border-purple-500/50",
        glow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
        subText: "text-purple-200",
      },
      green: {
        text: "text-emerald-300",
        wave: "text-emerald-400",
        bg: "bg-emerald-600",
        border: "border-emerald-500/50",
        glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
        subText: "text-emerald-200",
      },
      red: {
        text: "text-rose-300",
        wave: "text-rose-400",
        bg: "bg-rose-600",
        border: "border-rose-500/50",
        glow: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
        subText: "text-rose-200",
      },
      amber: {
        text: "text-amber-300",
        wave: "text-amber-400",
        bg: "bg-amber-600",
        border: "border-amber-500/50",
        glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
        subText: "text-amber-200",
      },
    };

    const theme = colorMap[color] || colorMap.cyan;

    // Generate 3 wave layers with slightly different phases/speeds
    // Using a smoother sine wave path that loops perfectly
    // Path creates 2 full cycles in 0-1200 width to ensure seamless loop when translating 50%
    // M0 60 Q 150 10 300 60 T 600 60 T 900 60 T 1200 60 V 120 H 0 Z
    // Adjusted for different heights/amplitudes per layer

    return (
      <div
        className={`relative h-28 bg-gray-950/80 border-2 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${theme.border} ${theme.glow}`}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none"></div>

        {/* Inner Shadow for "Container" feel */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-20 pointer-events-none rounded-xl"></div>

        {/* Wave Container */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out flex flex-col justify-end"
          style={{ height: `${p}%` }}
        >
          {/* Animated Wave SVG Container */}
          {/* Important: translate-y to push the wave SVG mostly below the 'water line' defined by height % */}
          {/* The SVG is 120px high. The path oscillates around Y=60. */}
          {/* We want Y=60 (center of wave) to align with the top edge of this container div. */}
          {/* Since this div's height IS the percentage, its top edge IS the water level. */}
          {/* So we need the wave SVG to sit such that its center is at the top edge. */}
          {/* transform: translateY(-50%) would center it vertically relative to its own height? No. */}
          {/* We just need to position it absolutely at top: 0, translate-y: -50% relative to the div top? */}
          {/* Current structure: Flex col justify end. The SVG is the first child. The body is the second. */}
          {/* If we use standard flow, the SVG sits ON TOP of the body. */}
          {/* We need the SVG to be positioned so its bottom half overlaps the body start, and top half sticks out. */}
          {/* Let's use absolute positioning for the wave relative to the water surface line. */}

          <div className="absolute bottom-full left-0 right-0 w-full h-10 translate-y-[50%] z-0">
            {/* Layer 1: Back, Slow, Low Opacity */}
            <div
              className="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave-slow opacity-30"
              style={{ animationDelay: `${delay}s` }}
            >
              <svg
                className={`w-1/2 h-full ${theme.wave} fill-current`}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path d="M0,60 C150,100 300,20 600,60 C900,100 1050,20 1200,60 V120 H0 Z" />
              </svg>
              <svg
                className={`w-1/2 h-full ${theme.wave} fill-current`}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path d="M0,60 C150,100 300,20 600,60 C900,100 1050,20 1200,60 V120 H0 Z" />
              </svg>
            </div>

            {/* Layer 2: Middle, Medium Speed */}
            <div
              className="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave opacity-50"
              style={{
                animationDuration: "7s",
                animationDelay: `${delay - 1}s`,
              }}
            >
              <svg
                className={`w-1/2 h-full ${theme.wave} fill-current`}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path d="M0,60 C200,30 400,90 600,60 C800,30 1000,90 1200,60 V120 H0 Z" />
              </svg>
              <svg
                className={`w-1/2 h-full ${theme.wave} fill-current`}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path d="M0,60 C200,30 400,90 600,60 C800,30 1000,90 1200,60 V120 H0 Z" />
              </svg>
            </div>

            {/* Layer 3: Front, Fast, High Opacity */}
            <div
              className="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave opacity-90"
              style={{
                animationDuration: "5s",
                animationDelay: `${delay - 2}s`,
              }}
            >
              <svg
                className={`w-1/2 h-full ${theme.wave} fill-current`}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path d="M0,60 C150,20 300,100 600,60 C900,20 1050,100 1200,60 V120 H0 Z" />
              </svg>
              <svg
                className={`w-1/2 h-full ${theme.wave} fill-current`}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path d="M0,60 C150,20 300,100 600,60 C900,20 1050,100 1200,60 V120 H0 Z" />
              </svg>
            </div>
          </div>

          {/* Liquid Body with Glow and Glass effect */}
          <div
            className={`w-full h-full ${theme.bg} opacity-60 backdrop-blur-[2px] shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)]`}
          ></div>
        </div>

        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
          {/* Semi-transparent backdrop for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>

          <div className="relative z-20 flex flex-col items-center">
            <div className="text-[10px] text-gray-200 uppercase tracking-widest mb-1 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mix-blend-plus-lighter">
              {label}
            </div>
            <div
              className={`text-2xl sm:text-3xl font-mono font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-baseline gap-1 ${theme.glow}`}
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              {value}
              <span
                className={`text-xs font-normal opacity-90 ${theme.subText || theme.text} drop-shadow-md`}
              >
                {unit}
              </span>
            </div>
            <div className="text-[9px] text-gray-200 mt-2 font-mono bg-black/80 px-2 py-0.5 rounded backdrop-blur-md border border-white/20 shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
              {p.toFixed(1)}% {t("hud.capacity")}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default WaveProgress;
