import { useState } from 'react';
import { calculateFrame } from '../utils/logGenerator';

export const useGameEngine = (initialStats) => {
  const [logs, setLogs] = useState([]);
  const [isBooting, setIsBooting] = useState(true);
  const [playerStats, setPlayerStats] = useState(initialStats);
  const [buffs, setBuffs] = useState([]);
  const [debuffs, setDebuffs] = useState([]);
  
  const handleBootComplete = () => {
    setIsBooting(false);
    // No auto-generated logs. Clean start.
    
    setBuffs([
        { id: 1, name: "Well Rested", duration: "3:45:20", effect: "+20% XP", icon: "✨" },
        { id: 2, name: "Coffee Boost", duration: "0:28:15", effect: "+15 Mental/min", icon: "☕" },
    ]);
    setDebuffs([
        { id: 1, name: "Sleep Debt", duration: "∞", effect: "-5% Max HP", icon: "😴" },
    ]);
  };

  const addLog = (logData) => {
    const now = new Date();
    // Use a default date for frame calculation if birthday is not set yet
    const frame = playerStats.birthday ? calculateFrame(playerStats.birthday) : "UNKNOWN";
    
    // Store in ISO (UTC) format for consistency
    const newLog = {
      id: Date.now() + Math.random(),
      timestamp: now.toISOString(), // Changed to ISO
      date: now.toISOString().split("T")[0], // Still keep YYYY-MM-DD for simple grouping if needed
      frame: frame,
      type: logData.type,
      category: logData.category,
      message: logData.message,
      icon: logData.icon || "📝",
      fullDate: now,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  return {
    logs,
    setLogs,
    isBooting,
    setIsBooting,
    playerStats,
    setPlayerStats,
    buffs,
    setBuffs,
    debuffs,
    setDebuffs,
    handleBootComplete,
    addLog,
    updateVitals: (stats) => setPlayerStats(prev => ({ ...prev, ...stats }))
  };
};
