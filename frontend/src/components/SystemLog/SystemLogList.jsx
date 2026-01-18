import React from "react";
import { Terminal, Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import SystemLogFilter from "./SystemLogFilter";
import {
  getLogDate,
  getTypeColor,
  parseLogContent,
  parseLogTrace,
} from "../../utils/logHelpers";

const SystemLogList = ({
  logs,
  loading,
  selectedLog,
  isCreating,
  onSelectLog,
  onEdit,
  onDeleteClick,
  filters,
  onFilterChange,
  isFilterOpen,
}) => {
  const { t } = useTranslation();

  const renderLogSummary = (content) => {
    const data = parseLogContent(content);
    if (!data) return <span className="text-gray-500">Empty Content</span>;

    const trace = data?.sysTrace;

    // Fallback if trace is missing but body exists
    if (!trace) {
      return (
        <span className="text-gray-300">
          {data.body ? data.body.substring(0, 50) + "..." : "Empty Log"}
        </span>
      );
    }

    const parsedTrace = parseLogTrace(trace);

    if (parsedTrace) {
      return (
        <div className="flex flex-wrap items-center gap-x-2 text-[11px] md:text-xs leading-tight font-mono">
          <span className="text-gray-400 font-medium whitespace-nowrap">
            {parsedTrace.time}
          </span>
          <span className="text-emerald-500 font-bold whitespace-nowrap">
            {parsedTrace.frame}
          </span>
          <span className="text-cyan-400 font-bold whitespace-nowrap">
            {parsedTrace.category}
          </span>
          <span className="text-yellow-400 font-black whitespace-nowrap">
            {parsedTrace.type}:
          </span>
          <span className="text-white font-medium break-all">
            {parsedTrace.message}
          </span>
        </div>
      );
    }
    return <span className="text-gray-200 font-mono">{trace}</span>;
  };

  return (
    <div
      className={`
        ${selectedLog || isCreating ? "hidden md:flex" : "flex"} 
        w-full md:w-1/3 border-r border-white/10 overflow-hidden bg-black/20 flex-col
    `}
    >
      {/* Filter Section */}
      <div className="p-4 border-b border-white/5 bg-black/40 relative z-40">
        <SystemLogFilter
          filters={filters}
          onFilterChange={onFilterChange}
          isOpen={isFilterOpen}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {logs.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-300 font-mono gap-4 p-6 h-full">
            <Terminal className="w-8 h-8 text-cyan-400" />
            <div className="text-center">
              <div className="text-sm text-gray-200 font-bold">
                {t("logs.no_logs")}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Initialize your first entry to begin tracking.
              </div>
            </div>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log._id || log.id}
              onClick={() => onSelectLog(log)}
              className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all group relative ${
                selectedLog?._id === log._id && !isCreating
                  ? "bg-cyan-900/20 border-l-4 border-l-cyan-500"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-gray-500 group-hover:text-cyan-400 transition-colors">
                  {new Date(getLogDate(log)).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getTypeColor(
                      log.type,
                    )}`}
                  >
                    {log.type}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => onEdit(e, log)}
                      className="p-1 hover:text-cyan-400 text-gray-500 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => onDeleteClick(e, log._id)}
                      className="p-1 hover:text-red-400 text-gray-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="min-h-[1.5em]">
                {renderLogSummary(log.content)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemLogList;
