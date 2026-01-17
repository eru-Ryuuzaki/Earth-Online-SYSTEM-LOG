import React, { useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info, AlertOctagon } from "lucide-react";

const SystemToast = ({ id, message, type = "INFO", duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    INFO: {
      border: "border-cyan-500",
      bg: "bg-cyan-950/90",
      text: "text-cyan-400",
      icon: <Info className="w-5 h-5" />,
      shadow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
    },
    SUCCESS: {
      border: "border-green-500",
      bg: "bg-green-950/90",
      text: "text-green-400",
      icon: <CheckCircle className="w-5 h-5" />,
      shadow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    },
    WARNING: {
      border: "border-yellow-500",
      bg: "bg-yellow-950/90",
      text: "text-yellow-400",
      icon: <AlertTriangle className="w-5 h-5" />,
      shadow: "shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    },
    ERROR: {
      border: "border-red-500",
      bg: "bg-red-950/90",
      text: "text-red-400",
      icon: <AlertOctagon className="w-5 h-5" />,
      shadow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    },
  };

  const style = styles[type] || styles.INFO;

  return (
    <div
      className={`
        pointer-events-auto
        flex items-start gap-3 p-4 rounded-md border ${style.border} ${style.bg} 
        backdrop-blur-md ${style.shadow}
        min-w-[300px] max-w-md
        animate-in slide-in-from-right-full duration-300
        hover:scale-[1.02] transition-transform
      `}
      role="alert"
    >
      <div className={`${style.text} shrink-0 mt-0.5 animate-pulse`}>
        {style.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-bold ${style.text} tracking-widest mb-1 uppercase`}>
          System Notification // {type}
        </div>
        <div className="text-sm text-gray-200 font-mono leading-relaxed break-words">
          {message}
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-white transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SystemToast;
