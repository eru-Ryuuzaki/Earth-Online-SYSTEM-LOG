import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = API_BASE_URL;

export const useSystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async (filters = {}) => {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("player_info");

    if (!token || !userStr) return;

    const user = JSON.parse(userStr);

    setLoading(true);
    try {
      // Remove undefined/null keys from filters
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, v]) => v !== undefined && v !== "" && v !== null,
        ),
      );

      const res = await axios.get(`${API_URL}/logs/timeline`, {
        params: { userId: user._id, limit: 100, ...cleanFilters },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      // 适配数据结构: API直接返回数组，或者是 { logs: [] }
      let allLogs = [];

      // 优先检查 res.data 是否直接为数组
      if (Array.isArray(res.data)) {
        allLogs = res.data;
      }
      // 检查 res.data.logs 是否为数组 (标准包装)
      else if (res.data?.logs && Array.isArray(res.data.logs)) {
        allLogs = res.data.logs;
      }
      // 检查 res.data.data 是否为数组 (常见包装)
      else if (res.data?.data && Array.isArray(res.data.data)) {
        allLogs = res.data.data;
      }

      console.log("[useSystemLogs] Parsed logs count:", allLogs.length);

      setLogs(allLogs);
    } catch (err) {
      console.error("Failed to fetch system logs", err);
    }
    setLoading(false);
  }, []);

  // Load on mount
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Updated addLog to accept full log object
  const addLog = useCallback(async (
    content,
    type,
    logDate,
    category = "USER_LOG",
    metadata = {},
  ) => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
      await axios.post(
        `${API_URL}/logs/commit`,
        {
          content,
          status: "STABLE", // Default status for user logs (must match backend enum)
          category: category,
          type: type || "NOTE", // The selected type (NOTE, TODO, etc.)
          logDate,
          metadata, // Send metadata (weather, mood, energy, icon) explicitly
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000, // 15s timeout to prevent hanging
        },
      );
      // Refresh list immediately, but don't block success if refresh fails
      fetchLogs().catch((e) => console.warn("Background refresh failed", e));
      return true;
    } catch (err) {
      console.error("Failed to add log", err);
      return false;
    }
  }, [fetchLogs]);

  const deleteLog = useCallback(async (id) => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;
    try {
      await axios.delete(`${API_URL}/logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs((prev) => prev.filter((log) => log._id !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete log", err);
      return false;
    }
  }, []);

  const updateLog = useCallback(async (id, updates) => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;
    try {
      const res = await axios.patch(`${API_URL}/logs/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local state
      setLogs((prev) =>
        prev.map((log) => (log._id === id ? { ...log, ...res.data } : log)),
      );
      return true;
    } catch (err) {
      console.error("Failed to update log", err);
      return false;
    }
  }, []);

  return {
    logs,
    loading,
    addLog,
    deleteLog,
    updateLog,
    refreshLogs: fetchLogs,
  };
};
