import React from "react";

const LogFormIcon = ({ icon, setIcon, setIsCustomIcon, commonIcons }) => {
  return (
    <div>
      <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-bold">
        Icon Selection
      </label>

      {/* 快速选择常用图标 */}
      <div className="flex flex-wrap gap-2 mb-2">
        {commonIcons.map((emoji, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setIcon(emoji);
              setIsCustomIcon(true);
            }}
            className={`w-8 h-8 flex items-center justify-center text-lg rounded border transition-all ${
              icon === emoji
                ? "border-cyan-500 bg-cyan-500/20 scale-110"
                : "border-gray-700 bg-black/40 hover:border-cyan-500 hover:scale-105"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* 自定义图标输入 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={icon}
          onChange={(e) => {
            setIcon(e.target.value);
            setIsCustomIcon(true);
          }}
          maxLength={2}
          className="w-12 bg-black/60 border border-gray-700 rounded px-2 py-1 text-cyan-100 text-center text-lg hover:border-cyan-500 transition-colors focus:border-cyan-500 outline-none"
          placeholder="📝"
        />
        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Custom Emoji</span>
      </div>
    </div>
  );
};

export default LogFormIcon;
