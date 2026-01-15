import { useState, useEffect } from "react";

const STORAGE_KEY = "earth_ol_system_logs";

const SYSTEM_FEEDBACK_POOL = [
  "[SYSTEM]: Entry recorded. No improvement detected.",
  "[SYSTEM]: Survival confirmed.",
  "[SYSTEM]: Emotional fluctuation archived.",
  "[SYSTEM]: Timeline extended.",
  "[SYSTEM]: Existence verified.",
  "[SYSTEM]: Memory fragment secured.",
  "[SYSTEM]: Status quo maintained.",
  "[SYSTEM]: Data point added to entropy.",
];

export const useSystemLogs = () => {
  const [logs, setLogs] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem(STORAGE_KEY);
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse system logs", e);
      }
    }
  }, []);

  // Save to local storage whenever logs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const getRandomFeedback = () => {
    const index = Math.floor(Math.random() * SYSTEM_FEEDBACK_POOL.length);
    return SYSTEM_FEEDBACK_POOL[index];
  };

  const addLog = (content, status) => {
    const now = new Date();
    const newLog = {
      id: Date.now(), // Simple ID
      entryIdDisplay: `#${Math.floor(Math.random() * 9000) + 1000}`, // Mock ID like #1024
      timestamp: now.toISOString(),
      content: content || null,
      status: status || "UNKNOWN",
      systemFeedback: getRandomFeedback(),
      createdAt: now.toISOString(),
      deletedAt: null,
    };

    setLogs((prev) => [newLog, ...prev]);
    return newLog;
  };

  const deleteLog = (id) => {
    // Soft delete
    setLogs((prev) =>
      prev.map((log) =>
        log.id === id ? { ...log, deletedAt: new Date().toISOString() } : log
      )
    );
  };

  const getActiveLogs = () => {
    return logs.filter((log) => !log.deletedAt);
  };

  return {
    logs: getActiveLogs(),
    allLogs: logs,
    addLog,
    deleteLog,
  };
};
