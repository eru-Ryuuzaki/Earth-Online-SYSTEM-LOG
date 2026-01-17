import React, { useState, useEffect } from "react";
import SystemLogCreate from "./SystemLogCreate";
import SystemLogFilter from "./SystemLogFilter";
import SystemConfirmDialog from "../SystemConfirmDialog";
import { useSystemLogs } from "../../hooks/useSystemLogs";
import {
  Terminal,
  List,
  Plus,
  RefreshCw,
  BookOpen,
  Settings,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";

const SystemLogModule = ({
  onToggleSettings,
  playerStats,
  onUpdateVitals,
  onLogAdded,
  selectedLog,
  onSelectLog: setSelectedLog,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [filters, setFilters] = useState({});

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { logs, addLog, refreshLogs, deleteLog, updateLog, loading } =
    useSystemLogs();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    refreshLogs(newFilters);
  };

  const handleSave = async (content, type, date, category, metadata) => {
    let success = false;
    if (editingLog) {
      success = await updateLog(editingLog._id, {
        content,
        type,
        logDate: date,
        category,
        metadata,
      });
      if (success) addToast(t("logs.toasts.update_success"), "SUCCESS");
    } else {
      success = await addLog(content, type, date, category, metadata);
      if (success) {
        if (onLogAdded) onLogAdded();
        try {
          if (metadata && onUpdateVitals) {
            // Example vital update logic
            onUpdateVitals({
              hp: parseInt(metadata.energy) || playerStats.hp,
            });
          }
        } catch (e) {}
        addToast(t("logs.toasts.success_save"), "SUCCESS");
      }
    }

    if (success) {
      setIsCreating(false);
      setEditingLog(null);
      refreshLogs(filters); // Refresh with current filters
      if (onLogAdded) onLogAdded(); // Refresh HUD stats (including calendar)
    }
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const success = await deleteLog(deleteId);
    if (success) {
      addToast(t("logs.toasts.delete_success"), "SUCCESS");
      if (selectedLog?._id === deleteId) setSelectedLog(null);
      if (onLogAdded) onLogAdded(); // Refresh HUD stats (including calendar)
    }
    setDeleteId(null);
  };

  const handleEdit = (e, log) => {
    e.stopPropagation();
    setEditingLog(log);
    setIsCreating(true);
    setSelectedLog(null); // Deselect to show edit form
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setEditingLog(null);
  };

  // If selectedLog is provided via props, we don't need internal state for it.
  // The prop 'selectedLog' and 'setSelectedLog' are used throughout.

  const getLogDate = (log) => {
    try {
      const content =
        typeof log.content === "string" ? JSON.parse(log.content) : log.content;
      if (content?.logDate) {
        // If it's a YYYY-MM-DD string, construct local date to avoid timezone shift
        if (/^\d{4}-\d{2}-\d{2}$/.test(content.logDate)) {
          const [y, m, d] = content.logDate.split("-").map(Number);
          return new Date(y, m - 1, d);
        }
        return content.logDate;
      }
    } catch (e) {}
    return log.logDate || log.createdAt || log.timestamp;
  };

  const getLogSummary = (content) => {
    try {
      if (!content) return <span className="text-gray-500">Empty Content</span>;

      let data;
      // Handle if content is already an object
      if (typeof content === "object") {
        data = content;
      } else {
        data = JSON.parse(content);
      }

      const trace = data?.sysTrace;

      // Fallback if trace is missing but body exists
      if (!trace) {
        return (
          <span className="text-gray-300">
            {data.body ? data.body.substring(0, 50) + "..." : "Empty Log"}
          </span>
        );
      }

      // Parse trace: [TIME][Frame X][CAT]TYPE: ICON MSG
      // Example: [2023-10-27 10:30:00.123][Frame 123456][PERSONAL]NOTE: 📝 Today's highlight
      const match = trace.match(/^(\[.*?\])(\[Frame.*?\])(\[.*?\])(.*?):(.*)/);

      if (match) {
        return (
          <div className="flex flex-wrap items-center gap-x-2 text-[11px] md:text-xs leading-tight font-mono">
            <span className="text-gray-400 font-medium whitespace-nowrap">
              {match[1]}
            </span>
            <span className="text-emerald-500 font-bold whitespace-nowrap">
              {match[2]}
            </span>
            <span className="text-cyan-400 font-bold whitespace-nowrap">
              {match[3]}
            </span>
            <span className="text-yellow-400 font-black whitespace-nowrap">
              {match[4]}:
            </span>
            <span className="text-white font-medium break-all">{match[5]}</span>
          </div>
        );
      }
      return <span className="text-gray-200 font-mono">{trace}</span>;
    } catch (e) {
      // If content is not JSON, display it as raw text
      return (
        <span className="text-gray-300 font-sans">
          {content.substring(0, 80)}...
        </span>
      );
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "NOTE":
        return "text-blue-300 bg-blue-500/20 border-blue-400/30";
      case "TODO":
        return "text-yellow-300 bg-yellow-500/20 border-yellow-400/30";
      case "IDEA":
        return "text-purple-300 bg-purple-500/20 border-purple-400/30";
      case "MEMORY":
        return "text-pink-300 bg-pink-500/20 border-pink-400/30";
      case "DREAM":
        return "text-indigo-300 bg-indigo-500/20 border-indigo-400/30";
      case "OBSERVATION":
        return "text-cyan-300 bg-cyan-500/20 border-cyan-400/30";
      case "INFO":
        return "text-cyan-300 bg-cyan-500/20 border-cyan-400/30";
      case "WARNING":
        return "text-orange-300 bg-orange-500/20 border-orange-400/30";
      case "ERROR":
        return "text-red-300 bg-red-500/20 border-red-400/30";
      case "SUCCESS":
        return "text-green-300 bg-green-500/20 border-green-400/30";
      case "DREAM":
      case "NIGHTMARE":
      case "LUCID":
      case "VISION":
      case "DEJA_VU":
        return "text-indigo-300 bg-indigo-500/20 border-indigo-400/30";
      default:
        return "text-gray-300 bg-gray-500/20 border-gray-400/30";
    }
  };

  const renderDetailContent = (log) => {
    let data = {
      body:
        typeof log.content === "string"
          ? log.content
          : "Log content unavailable",
    };
    try {
      if (typeof log.content === "object") {
        data = log.content;
      } else {
        const parsed = JSON.parse(log.content);
        if (parsed && typeof parsed === "object") data = parsed;
      }
    } catch (e) {}

    return (
      <div className="space-y-6">
        {/* Header / SysTrace */}
        <div className="bg-black/60 border border-cyan-500/40 p-4 rounded font-mono text-sm text-cyan-300 break-all shadow-[0_0_15px_rgba(6,182,212,0.15)] leading-relaxed">
          {data.sysTrace || data.body}
        </div>

        {/* Metadata if exists */}
        {data.metadata && (
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-white/10 p-4 rounded-lg border border-white/10">
            {data.metadata.weather && (
              <div
                className="flex items-center gap-2 text-sm text-gray-200"
                title="Weather"
              >
                <span className="text-gray-300 uppercase font-bold text-xs tracking-wider">
                  Weather:
                </span>
                <span className="text-xl">{data.metadata.weather}</span>
              </div>
            )}
            {data.metadata.mood && (
              <div
                className="flex items-center gap-2 text-sm text-gray-200"
                title="Mood"
              >
                <span className="text-gray-300 uppercase font-bold text-xs tracking-wider">
                  Mood:
                </span>
                <span className="text-xl">{data.metadata.mood}</span>
              </div>
            )}
            {data.metadata.energy !== undefined && (
              <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                  Energy
                </span>
                <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden flex-shrink-0 border border-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500"
                    style={{ width: `${data.metadata.energy}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  {data.metadata.energy}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="prose prose-invert max-w-none">
          <div className="text-[10px] uppercase text-gray-400 mb-2 tracking-widest font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            Detailed Log
          </div>
          <div className="text-gray-100 text-base whitespace-pre-wrap leading-relaxed bg-black/30 p-6 rounded-lg border border-white/10 font-sans shadow-inner min-h-[100px]">
            {data.body || (
              <span className="text-gray-500 italic">
                No detailed content provided.
              </span>
            )}
          </div>
        </div>

        {/* System Feedback */}
        {log.systemFeedback && (
          <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg flex gap-4 items-start">
            <Terminal className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase text-cyan-400/80 mb-1 tracking-widest font-bold">
                System Feedback
              </div>
              <div className="text-cyan-100 text-sm italic">
                "{log.systemFeedback}"
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full h-full md:h-[600px] bg-gray-950/95 border border-cyan-500/20 rounded-xl text-white overflow-hidden font-sans relative mb-0 md:mb-6 backdrop-blur-xl shadow-[0_0_40px_rgba(8,145,178,0.1)] flex flex-col">
      <SystemConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="DELETE LOG ENTRY"
        message="This action will permanently erase the selected memory block. This data cannot be recovered. Are you sure you want to proceed?"
        confirmText="DELETE"
        type="DANGER"
      />
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-black/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 hidden md:block">
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          {/* Mobile Back Button for Detail/Create View */}
          {(selectedLog || isCreating) && (
            <button
              onClick={() => {
                setSelectedLog(null);
                setIsCreating(false);
              }}
              className="md:hidden p-2 -ml-2 text-cyan-400 hover:bg-white/10 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <h2 className="text-sm font-bold text-white tracking-wide shadow-black drop-shadow-md">
              {selectedLog || isCreating
                ? isCreating
                  ? t("logs.new_log")
                  : "LOG DETAILS"
                : t("logs.title")}
            </h2>
            <div className="text-[10px] text-cyan-400/80 font-mono hidden md:block">
              EARTH ONLINE V2.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {!isCreating && (
            <div className="flex gap-2 text-xs font-mono bg-black/40 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingLog(null);
                  setSelectedLog(null);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-all bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-bold">NEW</span>
              </button>
              <div className="w-px bg-white/10 mx-1 my-1"></div>
              <button
                onClick={() => refreshLogs(filters)}
                className={`flex items-center justify-center w-8 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors ${
                  loading ? "animate-spin text-cyan-400" : ""
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={onToggleSettings}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: LIST */}
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
              onFilterChange={handleFilterChange}
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
                  onClick={() => {
                    setSelectedLog(log);
                    setIsCreating(false);
                    setEditingLog(null);
                  }}
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

                      {/* Actions: Only show for logs owned by user (implied) or all if admin. Assume all for now */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleEdit(e, log)}
                          className="p-1 hover:text-cyan-400 text-gray-500 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, log._id)}
                          className="p-1 hover:text-red-400 text-gray-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="min-h-[1.5em]">
                    {getLogSummary(log.content)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL: DETAIL / CREATE / EMPTY */}
        <div
          className={`
            ${!selectedLog && !isCreating ? "hidden md:flex" : "flex"}
            w-full md:w-2/3 bg-black/40 relative overflow-hidden flex-col
        `}
        >
          {isCreating ? (
            <SystemLogCreate
              onCancel={handleCancelCreate}
              onSave={handleSave}
              playerStats={playerStats}
              initialData={editingLog}
            />
          ) : selectedLog ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 font-mono animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-start mb-8 pb-4 border-b border-white/10 hidden md:flex">
                <div>
                  <h3 className="text-xl text-white font-bold mb-1 tracking-tight shadow-black drop-shadow-sm">
                    Log Details
                  </h3>
                  <div className="text-[10px] text-gray-500 font-mono flex gap-4">
                    <span>ID: {selectedLog._id || selectedLog.id}</span>
                    <span className="text-cyan-600">|</span>
                    <span>CATEGORY: {selectedLog.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {renderDetailContent(selectedLog)}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Terminal className="w-24 h-24 mb-6 opacity-30 text-cyan-400" />
              <div className="text-xl font-mono tracking-[0.2em] text-cyan-500 font-bold mb-2">
                SYSTEM READY
              </div>
              <div className="text-sm text-gray-400 mb-8">
                Select a log entry to view details
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="px-8 py-3 border border-cyan-500/30 rounded hover:bg-cyan-500/10 hover:border-cyan-500/60 hover:text-cyan-300 transition-all text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              >
                [ CREATE NEW LOG ]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemLogModule;
