import React from "react";

const LogFormTypeSelector = ({
  categories,
  category,
  setCategory,
  availableTypes,
  type,
  setType,
  theme,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          1️⃣ Category <span className={`${theme.text}`}>(选择类别)</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white ${theme.hoverBorder} transition-colors`}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          2️⃣ Type <span className={`${theme.text}`}>(选择等级)</span>
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white ${theme.hoverBorder} transition-colors`}
        >
          {availableTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LogFormTypeSelector;
