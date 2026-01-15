import React, { useState } from "react";
import SystemLogHome from "./SystemLogHome";
import SystemLogCreate from "./SystemLogCreate";
import SystemLogTimeline from "./SystemLogTimeline";
import { useSystemLogs } from "../../hooks/useSystemLogs";

const SystemLogModule = ({ onClose }) => {
  const [view, setView] = useState("HOME"); // HOME, CREATE, TIMELINE
  const { logs, addLog, deleteLog } = useSystemLogs();

  const handleNavigate = (newView) => {
    setView(newView);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 text-white overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-gray-950 to-gray-950" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Navigation / Status Bar */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-mono text-cyan-500/80 tracking-widest">
              SYSTEM_LOG_MODULE_V1.0
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-mono text-gray-500 hover:text-white transition-colors"
          >
            [ EXIT MODULE ]
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {view === "HOME" && (
            <SystemLogHome onNavigate={handleNavigate} logCount={logs.length} />
          )}
          {view === "CREATE" && (
            <SystemLogCreate onNavigate={handleNavigate} onSave={addLog} />
          )}
          {view === "TIMELINE" && (
            <SystemLogTimeline
              logs={logs}
              onNavigate={handleNavigate}
              onDelete={deleteLog}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemLogModule;
