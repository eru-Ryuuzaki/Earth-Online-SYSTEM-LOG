import React, { useState, useEffect } from "react";
import { X, Save, AlertTriangle } from "lucide-react";

const STATUS_OPTIONS = [
  "STABLE",
  "UNSTABLE",
  "DEGRADED",
  "OVERLOADED",
  "EMPTY",
  "UNKNOWN",
];

const PLACEHOLDERS = [
  "Describe today's anomaly.",
  "Log any unresolved issue.",
  "Record what failed to progress.",
  "Input is optional. Existence is not.",
  "System status report required.",
  "Nothing happened? Record the nothingness.",
];

const SystemLogCreate = ({ onNavigate, onSave }) => {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [lastLog, setLastLog] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPlaceholder(
      PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
    );
  }, []);

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Simulate system processing delay
    setTimeout(() => {
      const newLog = onSave(content, status);
      setLastLog(newLog);
      setShowModal(true);
      setIsSubmitting(false);
    }, 800);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onNavigate("TIMELINE");
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="text-xl font-bold text-cyan-500 tracking-wider">
            EARTH ONLINE :: SYSTEM LOG
          </h2>
          <div className="flex gap-4 text-xs font-mono text-cyan-500/60 mt-1">
            <span>Entry ID: #PENDING</span>
            <span>
              Timestamp:{" "}
              {new Date().toISOString().slice(0, 16).replace("T", " ")}
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate("HOME")}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-8">
        {/* Status Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">
            System Status :
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setStatus(opt === status ? "" : opt)}
                className={`
                  px-3 py-2 text-xs font-mono border transition-all duration-300
                  ${
                    status === opt
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                      : "bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                  }
                `}
              >
                [{opt}]
              </button>
            ))}
          </div>
        </div>

        {/* Content Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">
            Log Content :
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full h-48 bg-black/40 border border-gray-800 rounded p-4 text-gray-300 font-mono placeholder-gray-700 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all resize-none"
          />
        </div>

        {/* Action */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`
              relative px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-sm transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isSubmitting ? "animate-pulse" : ""}
            `}
          >
            {isSubmitting ? "COMMITTING..." : "[ COMMIT ENTRY TO SYSTEM ]"}
          </button>
        </div>
      </div>

      {/* System Feedback Modal */}
      {showModal && lastLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gray-900 border border-cyan-500/50 max-w-md w-full p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />

            <div className="mb-6 space-y-2">
              <div className="text-cyan-500 font-mono text-xs tracking-widest">
                [ SYSTEM NOTIFICATION ]
              </div>
              <h3 className="text-xl font-bold text-white">Entry Committed</h3>
            </div>

            <div className="bg-black/50 border border-gray-800 p-4 mb-6 font-mono text-sm text-cyan-300/90 leading-relaxed">
              {lastLog.systemFeedback}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest uppercase transition-colors"
              >
                [ ACKNOWLEDGE ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogCreate;
