import React, { useState } from "react";
import SystemLogCreate from "./SystemLogCreate";
import { useSystemLogs } from "../../hooks/useSystemLogs";
import {
  Terminal,
  List,
  Plus,
  RefreshCw,
  BookOpen,
  Settings,
  ArrowLeft,
} from "lucide-react";

const SystemLogModule = ({ onToggleSettings, playerStats }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const { logs, addLog, refreshLogs, loading } = useSystemLogs();

  const handleSave = async (content, type) => {
    const success = await addLog(content, type);
    if (success) {
      setIsCreating(false);
    }
  };

  const getLogSummary = (content) => {
    try {
      const data = JSON.parse(content);
      if (data.sysTrace) return data.sysTrace;
    } catch (e) {
      // Ignore error
    }
    return content.length > 80 ? content.substring(0, 80) + "..." : content;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "NOTE":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "TODO":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "IDEA":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "MEMORY":
        return "text-pink-400 bg-pink-500/10 border-pink-500/20";
      case "DREAM":
        return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      case "OBSERVATION":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "INFO":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "WARNING":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "ERROR":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "SUCCESS":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const renderDetailContent = (log) => {
    let data = { body: log.content };
    try {
      const parsed = JSON.parse(log.content);
      if (parsed.sysTrace) data = parsed;
    } catch (e) {}

    return (
      <div className="space-y-6">
        {/* Header / SysTrace */}
        <div className="bg-black/40 border border-cyan-500/30 p-4 rounded font-mono text-xs text-cyan-300 break-all shadow-[0_0_10px_rgba(6,182,212,0.1)]">
          {data.sysTrace || data.body}
        </div>

        {/* Metadata if exists */}
        {data.metadata && (
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-white/5 p-3 rounded-lg border border-white/5">
            {data.metadata.weather && (
              <div
                className="flex items-center gap-2 text-xs text-gray-300"
                title="Weather"
              >
                <span className="text-gray-500 uppercase">Weather:</span>
                <span className="text-lg">{data.metadata.weather}</span>
              </div>
            )}
            {data.metadata.mood && (
              <div
                className="flex items-center gap-2 text-xs text-gray-300"
                title="Mood"
              >
                <span className="text-gray-500 uppercase">Mood:</span>
                <span className="text-lg">{data.metadata.mood}</span>
              </div>
            )}
            {data.metadata.energy !== undefined && (
              <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Energy
                </span>
                <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500"
                    style={{ width: `${data.metadata.energy}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  {data.metadata.energy}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="prose prose-invert max-w-none">
          <div className="text-[10px] uppercase text-gray-500 mb-2 tracking-widest font-bold">
            Detailed Log
          </div>
          <div className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed bg-black/20 p-6 rounded-lg border border-white/5 font-mono shadow-inner min-h-[100px]">
            {data.body || "No detailed content provided."}
          </div>
        </div>

        {/* System Feedback */}
        {log.systemFeedback && (
          <div className="bg-cyan-900/10 border border-cyan-500/20 p-4 rounded-lg flex gap-4 items-start">
            <Terminal className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase text-cyan-500/70 mb-1 tracking-widest font-bold">
                System Feedback
              </div>
              <div className="text-cyan-100/80 text-sm italic">
                "{log.systemFeedback}"
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full h-full md:h-[600px] bg-gray-950/90 border border-cyan-900/30 rounded-xl text-white overflow-hidden font-sans relative mb-0 md:mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(8,145,178,0.15)] flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-cyan-900/30 flex items-center justify-between px-4 md:px-6 bg-black/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-900/20 rounded-lg border border-cyan-500/20 hidden md:block">
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          {/* Mobile Back Button for Detail/Create View */}
          {(selectedLog || isCreating) && (
            <button
              onClick={() => {
                setSelectedLog(null);
                setIsCreating(false);
              }}
              className="md:hidden p-2 -ml-2 text-cyan-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <h2 className="text-sm font-bold text-cyan-100 tracking-wide">
              {selectedLog || isCreating
                ? isCreating
                  ? "NEW ENTRY"
                  : "LOG DETAILS"
                : "SYSTEM LOG"}
            </h2>
            <div className="text-[10px] text-cyan-500/60 font-mono hidden md:block">
              EARTH ONLINE V2.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {!isCreating && !selectedLog && (
            <div className="flex gap-2 text-xs font-mono bg-black/20 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => {
                  setIsCreating(true);
                  setSelectedLog(null);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-all bg-cyan-600 text-white shadow-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden md:inline">NEW</span>
              </button>
              <div className="w-px bg-white/10 mx-1 my-1"></div>
              <button
                onClick={refreshLogs}
                className={`flex items-center justify-center w-8 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors ${
                  loading ? "animate-spin" : ""
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={onToggleSettings}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
            w-full md:w-1/3 border-r border-cyan-900/30 overflow-y-auto custom-scrollbar bg-black/10 flex-col
        `}
        >
          {logs.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-500 font-mono gap-4 opacity-70 p-6">
              <Terminal className="w-8 h-8 text-cyan-500/50" />
              <div className="text-center">
                <div className="text-xs text-gray-600">No logs found.</div>
              </div>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log._id || log.id}
                onClick={() => {
                  setSelectedLog(log);
                  setIsCreating(false);
                }}
                className={`p-5 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all group ${
                  selectedLog?._id === log._id && !isCreating
                    ? "bg-cyan-900/10 border-l-4 border-l-cyan-500"
                    : "border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-gray-500 group-hover:text-cyan-400/70 transition-colors">
                    {new Date(
                      log.createdAt || log.timestamp
                    ).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getTypeColor(
                      log.type
                    )}`}
                  >
                    {log.type}
                  </span>
                </div>
                <div className="text-[10px] text-gray-300 line-clamp-2 font-mono leading-relaxed group-hover:text-white transition-colors break-all opacity-80">
                  {getLogSummary(log.content)}
                </div>
              </div>
            ))
          )}
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
              onCancel={() => setIsCreating(false)}
              onSave={handleSave}
              playerStats={playerStats}
            />
          ) : selectedLog ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 font-mono animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-start mb-8 pb-4 border-b border-white/10 hidden md:flex">
                <div>
                  <h3 className="text-xl text-cyan-100 font-bold mb-1 tracking-tight">
                    Log Details
                  </h3>
                  <div className="text-[10px] text-gray-600 font-mono flex gap-4">
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
            <div className="flex flex-col items-center justify-center h-full text-gray-500/30">
              <Terminal className="w-24 h-24 mb-4 opacity-20" />
              <div className="text-lg font-mono tracking-widest">
                SYSTEM READY
              </div>
              <div className="text-xs mt-2">
                Select a log entry to view details
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-8 px-6 py-2 border border-white/10 rounded hover:bg-white/5 hover:border-white/20 transition-all text-xs tracking-widest"
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
