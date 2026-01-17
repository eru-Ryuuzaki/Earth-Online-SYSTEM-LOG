import React, { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { logTemplates } from "../../data/logTemplates";
import { useTranslation } from "react-i18next";

const WEATHER_OPTS = ["☀️", "☁️", "🌧️", "⛈️", "❄️", "🌪️", "🌫️", "🌑"];
const MOOD_OPTS = ["😊", "😐", "😢", "😡", "🤔", "😴", "🤩", "🤯", "🧘"];

const SystemLogFilter = ({ filters, onFilterChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const categories = Object.keys(logTemplates);
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    // Debounce or just update on blur/enter? Let's update on blur or enter for now to avoid too many requests
  };

  const handleSearchSubmit = () => {
    onFilterChange({ ...filters, search: localSearch });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value === "ALL" ? "" : value });
  };

  const clearFilters = () => {
    setLocalSearch("");
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (k) => filters[k] !== "" && filters[k] !== undefined,
  ).length;

  const selectStyle =
    "w-full bg-cyan-950/60 border border-cyan-500/50 rounded px-2 py-1.5 text-xs text-cyan-50 outline-none focus:border-cyan-400 focus:bg-cyan-900/80 transition-all appearance-none cursor-pointer hover:border-cyan-400 hover:bg-cyan-900/60 shadow-[0_0_10px_rgba(6,182,212,0.1)]";
  const inputStyle =
    "w-full bg-cyan-950/60 border border-cyan-500/50 rounded px-2 py-1.5 text-xs text-cyan-50 outline-none focus:border-cyan-400 focus:bg-cyan-900/80 transition-all placeholder-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]";

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSearchSubmit}
            placeholder={t("logs.filter.search_placeholder")}
            className="w-full bg-black/60 border border-cyan-500/30 rounded pl-10 pr-4 py-2 text-cyan-100 placeholder-cyan-500/50 focus:border-cyan-500 outline-none transition-all font-mono text-sm"
          />
          <Search className="w-4 h-4 text-cyan-500 absolute left-3 top-2.5" />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 border rounded transition-colors flex items-center gap-2 ${
            isOpen || activeFilterCount > 0
              ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
              : "bg-black/40 border-gray-700 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/50"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold hidden md:inline">
            {t("logs.filter.button")}
          </span>
          {activeFilterCount > 0 && (
            <span className="bg-cyan-500 text-black text-[10px] font-bold px-1.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
            title="Clear Filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {isOpen && (
        <div className="bg-black/95 border border-cyan-500/30 rounded-lg p-5 animate-in slide-in-from-top-2 duration-200 backdrop-blur-xl absolute left-0 right-0 z-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] mt-2">
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
