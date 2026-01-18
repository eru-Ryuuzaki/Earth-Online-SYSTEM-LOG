import React, { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { logTemplates } from "../../data/logTemplates";
import { useTranslation } from "react-i18next";

const WEATHER_OPTS = ["☀️", "☁️", "🌧️", "⛈️", "❄️", "🌪️", "🌫️", "🌑"];
const MOOD_OPTS = ["😊", "😐", "😢", "😡", "🤔", "😴", "🤩", "🤯", "🧘"];

const SystemLogFilter = ({ filters, onFilterChange, isOpen }) => {
  const { t } = useTranslation();
  const categories = Object.keys(logTemplates);
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    // Debounce or just update on blur/enter? Let's update on blur or enter for now to avoid too many requests
  };

  const submitSearch = () => {
    onFilterChange({ ...filters, search: localSearch });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) delete newFilters[key];
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    // Keep search, clear others? Or clear all?
    // Usually clear filters means clear categories etc.
    const newFilters = { search: filters.search };
    onFilterChange(newFilters);
  };

  const selectStyle =
    "w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[10px] text-gray-300 focus:border-cyan-500/50 focus:outline-none appearance-none cursor-pointer hover:bg-white/5 transition-colors";

  const inputStyle =
    "w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[10px] text-gray-300 focus:border-cyan-500/50 focus:outline-none hover:bg-white/5 transition-colors";

  return (
    <div className="relative">
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onBlur={submitSearch}
            placeholder={t("logs.filter.search_placeholder")}
            className="w-full bg-black/40 border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isOpen && (
        <div className="bg-black/40 border-t border-white/5 pt-4 mt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-6">
            {/* ROW 1: Category & Type */}
            <div className="grid grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest pl-0.5 shadow-black drop-shadow-sm">
                  {t("logs.filter.label_category")}
                </label>
                <div className="relative group">
                  <select
                    value={filters.category || ""}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    className={selectStyle}
                  >
                    <option value="">{t("logs.filter.all_categories")}</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {t(`categories.${c}`).toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400 group-hover:text-cyan-200 transition-colors text-[10px]">
                    ▼
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest pl-0.5 shadow-black drop-shadow-sm">
                  {t("logs.filter.label_type")}
                </label>
                <div className="relative group">
                  <select
                    value={filters.type || ""}
                    onChange={(e) => updateFilter("type", e.target.value)}
                    className={selectStyle}
                  >
                    <option value="">{t("logs.filter.all_types")}</option>
                    {[
                      ...new Set(
                        Object.values(logTemplates)
                          .flat()
                          .map((t) => t.type),
                      ),
                    ]
                      .sort()
                      .map((type) => (
                        <option key={type} value={type}>
                          {t(`types.${type}`) || type}
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400 group-hover:text-cyan-200 transition-colors text-[10px]">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Energy & Environment */}
            <div className="grid grid-cols-2 gap-6">
              {/* Energy */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest pl-0.5 shadow-black drop-shadow-sm">
                  {t("logs.filter.label_energy")}
                </label>
                <div className="flex gap-2">
                  <div className="relative w-20 shrink-0 group">
                    <select
                      value={filters.energyOp || "eq"}
                      onChange={(e) => updateFilter("energyOp", e.target.value)}
                      className={`${selectStyle} text-center font-mono`}
                    >
                      <option value="eq">=</option>
                      <option value="gt">&gt;</option>
                      <option value="lt">&lt;</option>
                    </select>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400 group-hover:text-cyan-200 transition-colors text-[8px]">
                      ▼
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder={t("logs.filter.placeholder_value")}
                    value={filters.energyLevel || ""}
                    onChange={(e) =>
                      updateFilter("energyLevel", e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Environment (Weather & Mood) */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest pl-0.5 shadow-black drop-shadow-sm">
                  {t("logs.filter.label_environment")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative group">
                    <select
                      value={filters.weather || ""}
                      onChange={(e) => updateFilter("weather", e.target.value)}
                      className={selectStyle}
                    >
                      <option value="">
                        {t("logs.filter.option_weather")}
                      </option>
                      {WEATHER_OPTS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400 group-hover:text-cyan-200 transition-colors text-[8px]">
                      ▼
                    </div>
                  </div>
                  <div className="relative group">
                    <select
                      value={filters.mood || ""}
                      onChange={(e) => updateFilter("mood", e.target.value)}
                      className={selectStyle}
                    >
                      <option value="">{t("logs.filter.option_mood")}</option>
                      {MOOD_OPTS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400 group-hover:text-cyan-200 transition-colors text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogFilter;
