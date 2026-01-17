import React from "react";
import { useTranslation } from "react-i18next";

const LogFormTypeSelector = ({
  categories,
  category,
  setCategory,
  availableTypes,
  type,
  setType,
  theme = { text: "text-cyan-400", hoverBorder: "hover:border-cyan-500" },
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full bg-black/60 border border-gray-700 rounded px-2 py-1.5 text-xs text-cyan-100 outline-none focus:border-cyan-500 focus:bg-cyan-950/50 transition-all cursor-pointer ${theme.hoverBorder}`}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {t(`categories.${cat}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">
          Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`w-full bg-black/60 border border-gray-700 rounded px-2 py-1.5 text-xs text-cyan-100 outline-none focus:border-cyan-500 focus:bg-cyan-950/50 transition-all cursor-pointer ${theme.hoverBorder}`}
        >
          {availableTypes.map((typeOption) => (
            <option key={typeOption} value={typeOption}>
              {t(`types.${typeOption}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LogFormTypeSelector;
