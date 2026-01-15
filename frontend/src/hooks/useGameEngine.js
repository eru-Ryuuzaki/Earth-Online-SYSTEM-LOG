import { useState, useEffect, useRef } from 'react';
import { generateLog, calculateFrame } from '../utils/logGenerator';

export const useGameEngine = (initialStats) => {
  const [logs, setLogs] = useState([]);
  const [isBooting, setIsBooting] = useState(true);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [playerStats, setPlayerStats] = useState(initialStats);
  const [buffs, setBuffs] = useState([]);
  const [debuffs, setDebuffs] = useState([]);
  
  const autoGenerateInterval = useRef(null);

  // Auto Generate Logs
  useEffect(() => {
    if (autoGenerate && !isBooting) {
      autoGenerateInterval.current = setInterval(() => {
        const newLog = generateLog(playerStats.birthday);
        setLogs((prev) => [...prev, newLog]);
      }, 5000);
    } else {
      if (autoGenerateInterval.current) {
        clearInterval(autoGenerateInterval.current);
      }
    }

    return () => {
      if (autoGenerateInterval.current) {
        clearInterval(autoGenerateInterval.current);
      }
    };
  }, [autoGenerate, isBooting, playerStats.birthday]);

  const handleBootComplete = () => {
    setIsBooting(false);
    const now = new Date();
    setLogs(prev => [...prev, {
      id: Date.now(),
      timestamp: now.toTimeString().split(" ")[0] + "." + now.getMilliseconds().toString().padStart(3, "0"),
      date: now.toISOString().split("T")[0],
      frame: calculateFrame(playerStats.birthday),
      type: "SUCCESS",
      category: "system",
      message: "System initialized. Welcome back, Player.",
      icon: "✓",
      fullDate: now,
    }]);
    
    // Set initial buffs/debuffs
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
    const newLog = {
      id: Date.now() + Math.random(),
      timestamp: now.toTimeString().split(" ")[0] + "." + now.getMilliseconds().toString().padStart(3, "0"),
      date: now.toISOString().split("T")[0],
      frame: calculateFrame(playerStats.birthday),
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
    autoGenerate,
    setAutoGenerate,
    playerStats,
    setPlayerStats,
    buffs,
    setBuffs,
    debuffs,
    setDebuffs,
    handleBootComplete,
    addLog
  };
};
