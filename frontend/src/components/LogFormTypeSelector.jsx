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
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide">
          1️⃣ Category <span className={`${theme.text} text-xs font-normal opacity-80`}>{t("logs.filter_category")}</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white ${theme.hoverBorder} transition-colors`}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {t(`categories.${cat}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide">
          2️⃣ Type <span className={`${theme.text} text-xs font-normal opacity-80`}>(选择等级)</span>
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white ${theme.hoverBorder} transition-colors`}
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
