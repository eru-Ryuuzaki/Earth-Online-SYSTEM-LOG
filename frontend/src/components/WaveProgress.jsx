import React from "react";

const WaveProgress = ({
  label,
  value,
  unit,
  percentage,
  color = "cyan",
  delay = 0,
}) => {
  // Clamp percentage between 0 and 100
  const p = Math.min(100, Math.max(0, percentage));

  // Advanced Color Palettes (Cyberpunk/Sci-Fi Themed)
  const colorMap = {
    cyan: {
      text: "text-cyan-400",
      wave: "text-cyan-500",
      bg: "bg-cyan-500",
      glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
    },
    blue: {
      text: "text-blue-400",
      wave: "text-blue-500",
      bg: "bg-blue-600",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    },
    purple: {
      text: "text-purple-400",
      wave: "text-purple-500",
      bg: "bg-purple-600",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    },
    green: {
      text: "text-emerald-400",
      wave: "text-emerald-500",
      bg: "bg-emerald-600",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    },
    red: {
      text: "text-rose-400",
      wave: "text-rose-500",
      bg: "bg-rose-600",
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    },
    amber: {
      text: "text-amber-400",
      wave: "text-amber-500",
      bg: "bg-amber-600",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    },
  };

  const theme = colorMap[color] || colorMap.cyan;

  return (
    <div className="relative h-28 bg-gray-900/60 border border-white/5 rounded-lg overflow-hidden group hover:border-white/10 transition-all duration-500 hover:shadow-lg">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none"></div>

      {/* Wave Container */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out flex flex-col justify-end"
        style={{ height: `${p}%` }}
      >
        {/* Animated Wave SVG */}
        <div className="w-full h-6 relative overflow-hidden shrink-0 translate-y-[1px]">
          {/* Back Wave (Slower, Lower Opacity) */}
          <div
            className="absolute top-0 left-0 w-[200%] h-full flex animate-wave-slow opacity-30"
            style={{ animationDelay: `${delay}s` }}
          >
            <svg
              className={`w-1/2 h-full ${theme.wave} fill-current`}
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
            </svg>
            <svg
              className={`w-1/2 h-full ${theme.wave} fill-current`}
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
            </svg>
          </div>

          {/* Front Wave (Faster, Higher Opacity) */}
          <div
            className="absolute top-0 left-0 w-[200%] h-full flex animate-wave opacity-60"
            style={{ animationDelay: `${delay - 2}s` }}
          >
            <svg
              className={`w-1/2 h-full ${theme.wave} fill-current`}
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
              />
            </svg>
            <svg
              className={`w-1/2 h-full ${theme.wave} fill-current`}
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
              />
            </svg>
          </div>
        </div>

        {/* Liquid Body with Glow */}
        <div
          className={`flex-1 w-full ${theme.bg} opacity-20 backdrop-blur-[2px]`}
        ></div>
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
        {/* Semi-transparent backdrop for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        <div className="relative z-20 flex flex-col items-center">
          <div className="text-[10px] text-gray-300 uppercase tracking-widest mb-1 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mix-blend-plus-lighter">
            {label}
          </div>
          <div
            className={`text-3xl font-mono font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-baseline gap-1 ${theme.glow}`}
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            {value}
            <span
              className={`text-xs font-normal opacity-90 ${theme.text} drop-shadow-md`}
            >
              {unit}
            </span>
          </div>
          <div className="text-[9px] text-gray-300 mt-2 font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-md border border-white/10 shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
            {p.toFixed(1)}% Capacity
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveProgress;
