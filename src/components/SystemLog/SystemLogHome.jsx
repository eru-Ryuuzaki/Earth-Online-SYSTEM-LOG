import React from "react";
import { Terminal } from "lucide-react";

const SystemLogHome = ({ onNavigate, logCount }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1
          className="text-4xl md:text-6xl font-black tracking-tighter text-cyan-500 font-mono glitch-text"
          data-text="[SYSTEM MODULE]"
        >
          [SYSTEM MODULE]
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-cyan-400/80 tracking-widest uppercase">
          LIFE LOG INTERFACE
        </h2>
      </div>

      <div className="max-w-md mx-auto border-l-2 border-cyan-500/30 pl-6 py-2 text-left">
        <p className="text-gray-400 font-mono text-sm md:text-base leading-relaxed">
          All actions, including inaction, are subject to record.
          <br />
          <span className="text-cyan-500/50 text-xs mt-2 block">
            // Monitoring existence...
          </span>
        </p>
      </div>

      {logCount === 0 ? (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded max-w-sm mx-auto">
          <div className="text-red-400 font-bold text-sm mb-1">
            [SYSTEM NOTICE]
          </div>
          <div className="text-red-300/80 text-xs font-mono space-y-1">
            <p>No log entries detected.</p>
            <p>Player progress cannot be reconstructed.</p>
            <p>Time is still advancing.</p>
          </div>
        </div>
      ) : (
        <div className="text-cyan-500/60 font-mono text-sm">
          {logCount} entries archived in local memory.
        </div>
      )}

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => onNavigate("CREATE")}
          className="group relative px-8 py-4 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-bold tracking-widest uppercase transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative flex items-center justify-center gap-2">
            <Terminal className="w-5 h-5" />
            Initialize Log Entry
          </span>
        </button>

        {logCount > 0 && (
          <button
            onClick={() => onNavigate("TIMELINE")}
            className="text-gray-500 hover:text-cyan-400 text-sm font-mono tracking-widest transition-colors uppercase"
          >
            [ View Full Timeline ]
          </button>
        )}
      </div>
    </div>
  );
};

export default SystemLogHome;
