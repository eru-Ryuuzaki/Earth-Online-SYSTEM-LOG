import React, { useState } from "react";
import { ArrowLeft, Trash2, AlertOctagon } from "lucide-react";

const SystemLogTimeline = ({ logs, onNavigate, onDelete }) => {
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-800">
        <button
          onClick={() => onNavigate("HOME")}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-200 tracking-wider">
          TIMELINE ARCHIVE
        </h2>
        <div className="ml-auto">
          <button
            onClick={() => onNavigate("CREATE")}
            className="px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase transition-colors"
          >
            [ + NEW ENTRY ]
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6 relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800 -z-10" />

        {logs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-mono text-sm">
            [ No archived entries found ]
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="relative pl-12 group">
              {/* Timeline Dot */}
              <div className="absolute left-[13px] top-4 w-1.5 h-1.5 rounded-full bg-cyan-900 ring-4 ring-gray-900 group-hover:bg-cyan-500 transition-colors" />

              {/* Card */}
              <div className="bg-black/40 border border-gray-800 hover:border-cyan-500/30 p-5 rounded-lg transition-all duration-300 group-hover:bg-gray-900/40">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono text-cyan-500/70">
                      {log.entryIdDisplay}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {log.status && log.status !== "UNKNOWN" && (
                    <span
                      className={`
                      text-[10px] font-bold px-2 py-1 rounded border
                      ${
                        log.status === "STABLE"
                          ? "text-green-400 border-green-500/30 bg-green-500/10"
                          : log.status === "UNSTABLE"
                          ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                          : log.status === "DEGRADED"
                          ? "text-orange-400 border-orange-500/30 bg-orange-500/10"
                          : log.status === "OVERLOADED"
                          ? "text-red-400 border-red-500/30 bg-red-500/10"
                          : "text-gray-400 border-gray-500/30 bg-gray-500/10"
                      }
                    `}
                    >
                      {log.status}
                    </span>
                  )}
                </div>

                <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-4">
                  {log.content || (
                    <span className="text-gray-600 italic">
                      // No content recorded.
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
                  <div className="text-[10px] text-gray-600 font-mono italic truncate max-w-[200px]">
                    {log.systemFeedback}
                  </div>
                  <button
                    onClick={() => handleDeleteClick(log.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors p-1"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-red-500/30 max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-start gap-4 mb-4">
              <AlertOctagon className="w-8 h-8 text-red-500 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-red-500 mb-1">
                  [ SYSTEM WARNING ]
                </h3>
                <p className="text-sm text-gray-300">
                  Deleting this entry may cause timeline inconsistency. This
                  action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 text-xs font-bold uppercase transition-colors"
              >
                Proceed with Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogTimeline;
