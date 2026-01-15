import React, { useState, useEffect } from "react";

const TypewriterLog = ({ log, isLatest }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isLatest && currentIndex < log.message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + log.message[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (!isLatest) {
      setDisplayedText(log.message);
    }
  }, [currentIndex, log.message, isLatest]);

  const typeColors = {
    INFO: "text-cyan-400",
    SUCCESS: "text-green-400",
    WARNING: "text-yellow-400",
    ERROR: "text-red-400",
    DAMAGE: "text-red-500",
    HEAL: "text-green-500",
    CRITICAL: "text-purple-400",
    GAIN: "text-yellow-300",
    LOSS: "text-orange-400",
    TRADE: "text-blue-400",
    EVENT: "text-pink-400",
    QUEST: "text-indigo-400",
    BUFF: "text-emerald-400",
    DEBUFF: "text-rose-400",
    EXPIRED: "text-gray-400",
    UNLOCK: "text-amber-400",
    MILESTONE: "text-purple-500",
    PROGRESS: "text-teal-400",
  };

  return (
    <div className="font-mono text-sm mb-1 flex items-start gap-2">
      <span className="text-gray-500">[{log.timestamp}]</span>
      <span className="text-gray-600">
        [Frame {log.frame.toLocaleString()}]
      </span>
      <span className="text-gray-500">[{log.category}]</span>
      <span className={`font-bold ${typeColors[log.type]}`}>{log.type}:</span>
      <span className="text-gray-300 flex-1">
        {log.icon} {displayedText}
        {isLatest && currentIndex < log.message.length && (
          <span className="animate-pulse">|</span>
        )}
      </span>
    </div>
  );
};

export default TypewriterLog;
