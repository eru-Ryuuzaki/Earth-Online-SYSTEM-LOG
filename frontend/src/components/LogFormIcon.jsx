import React from "react";

const LogFormIcon = ({ icon, setIcon, setIsCustomIcon, commonIcons, theme }) => {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        4️⃣ Icon <span className={`${theme.text}`}>(选择或自定义图标)</span>
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
            className={`w-10 h-10 flex items-center justify-center text-xl rounded border transition-all ${
              icon === emoji
                ? `${theme.border} ${theme.bgLow} scale-110`
                : `border-gray-700 bg-gray-800 ${theme.hoverBorder} hover:scale-105`
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
          className={`w-20 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-center text-xl ${theme.hoverBorder} transition-colors`}
          placeholder="📝"
        />
        <span className="text-sm text-gray-500">或输入自定义 Emoji</span>
      </div>
    </div>
  );
};

export default LogFormIcon;
