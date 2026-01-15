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
} from "lucide-react";

const SystemLogModule = ({ onToggleSettings }) => {
  const [view, setView] = useState("VIEW");
  const [selectedLog, setSelectedLog] = useState(null);
  const { logs, addLog, refreshLogs, loading } = useSystemLogs();

  const handleSave = async (content, type) => {
    const success = await addLog(content, type);
    if (success) {
      setView("VIEW");
    }
  };

  const getLogSummary = (content) => {
    const subjectMatch = content.match(/^\[(.*?)\]/);
    if (subjectMatch) {
      return subjectMatch[1];
    }
    return content;
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
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full h-[600px] bg-gray-950/90 border border-cyan-900/30 rounded-xl text-white overflow-hidden font-sans relative mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(8,145,178,0.15)] flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-cyan-900/30 flex items-center justify-between px-6 bg-black/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-900/20 rounded-lg border border-cyan-500/20">
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-cyan-100 tracking-wide">
              PERSONAL LOG SYSTEM
            </h2>
            <div className="text-[10px] text-cyan-500/60 font-mono">
              EARTH ONLINE V2.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-xs font-mono bg-black/20 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setView("VIEW")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all ${
                view === "VIEW"
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>ARCHIVE</span>
            </button>
            <button
              onClick={() => setView("CREATE")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all ${
                view === "CREATE"
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>NEW ENTRY</span>
            </button>
            <div className="w-px bg-white/10 mx-1 my-1"></div>
            <button
              onClick={refreshLogs}
              className={`flex items-center justify-center w-8 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors ${
                loading ? "animate-spin" : ""
              }`}
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onToggleSettings}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {view === "CREATE" && (
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-0 bg-black/20">
            <SystemLogCreate
              onNavigate={(v) => setView(v)}
              onSave={handleSave}
            />
          </div>
        )}

        {view === "VIEW" && (
          <div className="flex h-full">
            {/* List Panel */}
            <div
              className={`${
                selectedLog ? "w-1/3" : "w-full"
              } border-r border-cyan-900/30 overflow-y-auto custom-scrollbar transition-all duration-300 bg-black/10`}
            >
              {logs.map((log) => (
                <div
                  key={log._id || log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-5 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all group ${
                    selectedLog?._id === log._id
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
                  <div className="text-sm text-gray-300 line-clamp-2 font-sans leading-relaxed group-hover:text-white transition-colors">
                    {getLogSummary(log.content)}
                  </div>
                </div>
              ))}
              {logs.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 font-mono gap-4 opacity-70">
                  <div className="w-16 h-16 rounded-full bg-cyan-900/20 flex items-center justify-center border border-cyan-500/20 mb-2">
                    <Terminal className="w-8 h-8 text-cyan-500/50" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-400 tracking-wide mb-1">
                      SYSTEM LOG EMPTY
                    </div>
                    <div className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                      No historical records found in the database.
                      <br />
                      Initialize your first entry to begin tracking.
                    </div>
                  </div>
                  <button
                    onClick={() => setView("CREATE")}
                    className="mt-4 px-6 py-2 bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-500/30 rounded text-cyan-400 text-xs font-bold tracking-widest transition-all"
                  >
                    [ INITIALIZE ENTRY ]
                  </button>
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedLog && (
              <div className="w-2/3 bg-black/40 overflow-y-auto custom-scrollbar p-8 font-mono animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-start mb-8 pb-4 border-b border-white/10">
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

                <div className="space-y-8 max-w-3xl mx-auto">
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5">
                    <div>
                      <div className="text-[10px] uppercase text-gray-500 mb-1 tracking-widest">
                        Time Recorded
                      </div>
                      <div className="text-sm text-white font-mono">
                        {new Date(
                          selectedLog.createdAt || selectedLog.timestamp
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase text-gray-500 mb-1 tracking-widest">
                        Entry Type
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded border ${getTypeColor(
                          selectedLog.type
                        )}`}
                      >
                        {selectedLog.type}
                      </span>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="text-[10px] uppercase text-gray-500 mb-3 tracking-widest font-bold">
                      Entry Content
                    </div>
                    <div className="text-gray-200 text-base whitespace-pre-wrap leading-relaxed bg-black/20 p-6 rounded-lg border border-white/5 shadow-inner">
                      {selectedLog.content}
                    </div>
                  </div>

                  {selectedLog.systemFeedback && (
                    <div className="bg-cyan-900/10 border border-cyan-500/20 p-4 rounded-lg flex gap-4 items-start">
                      <Terminal className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] uppercase text-cyan-500/70 mb-1 tracking-widest font-bold">
                          System Feedback
                        </div>
                        <div className="text-cyan-100/80 text-sm italic">
                          "{selectedLog.systemFeedback}"
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogModule;
