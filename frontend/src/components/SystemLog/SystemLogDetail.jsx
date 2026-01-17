import React from "react";
import { Terminal, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { parseLogContent } from "../../utils/logHelpers";
import { getSystemFeedbackKey } from "../../utils/feedbackUtils";
import SystemLogCreate from "./SystemLogCreate";

const SystemLogDetail = ({
  selectedLog,
  isCreating,
  editingLog,
  onClose,
  onCancelCreate,
  onSave,
  playerStats,
  onCreateClick,
}) => {
  const { t } = useTranslation();

  const renderDetailContent = (log) => {
    const data = parseLogContent(log.content) || {
      body: "Log content unavailable",
    };

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
                {t("logs.system_feedback")}
              </div>
              <div className="text-cyan-100 text-sm italic">
                "
                {t(
                  `logs.feedback.${getSystemFeedbackKey(log.systemFeedback)}`,
                  { defaultValue: log.systemFeedback },
                )}
                "
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        ${!selectedLog && !isCreating ? "hidden md:flex" : "flex"}
        w-full md:w-2/3 bg-black/40 relative overflow-hidden flex-col
    `}
    >
      {isCreating ? (
        <SystemLogCreate
          onCancel={onCancelCreate}
          onSave={onSave}
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
              onClick={onClose}
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
            onClick={onCreateClick}
            className="px-8 py-3 border border-cyan-500/30 rounded hover:bg-cyan-500/10 hover:border-cyan-500/60 hover:text-cyan-300 transition-all text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          >
            [ CREATE NEW LOG ]
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemLogDetail;
