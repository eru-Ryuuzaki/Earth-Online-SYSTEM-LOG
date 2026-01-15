import React from "react";

const LogFormPreview = ({ category, type, icon, message }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case "INFO": return "text-cyan-400";
      case "SUCCESS": return "text-green-400";
      case "WARNING": return "text-yellow-400";
      case "ERROR": return "text-red-400";
      case "DAMAGE": return "text-red-500";
      case "HEAL": return "text-green-500";
      case "CRITICAL": return "text-purple-400";
      case "GAIN": return "text-yellow-300";
      case "LOSS": return "text-orange-400";
      default: return "text-cyan-400";
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
      <div className="text-xs text-gray-500 mb-2">Preview:</div>
      <div className="font-mono text-sm flex items-start gap-2">
        <span className="text-gray-500">[HH:MM:SS.mmm]</span>
        <span className="text-gray-600">[Frame XXXXXXXXXX]</span>
        <span className="text-gray-500">[{category}]</span>
        <span className={`font-bold ${getTypeColor(type)}`}>
          {type}:
        </span>
        <span className="text-gray-300 flex-1">
          {icon} {message || "Your message will appear here..."}
        </span>
      </div>
    </div>
  );
};

export default LogFormPreview;
