import React from 'react';
import { Book, Plus, Settings } from "lucide-react";

const ActionBar = ({ 
  onShowSystemLog, 
  onToggleLogForm, 
  onToggleSettings, 
  autoGenerate, 
  setAutoGenerate 
}) => {
  return (
    <div className="max-w-7xl mx-auto mb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onShowSystemLog}
          className="flex items-center gap-2 bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-500/50 px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Book className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-cyan-100 font-bold tracking-wider">
            SYSTEM LOG
          </span>
        </button>

        <button
          onClick={onToggleLogForm}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Log Entry
        </button>

        <button
          onClick={onToggleSettings}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
              className="w-4 h-4"
            />
            Auto Generate Logs
          </label>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
