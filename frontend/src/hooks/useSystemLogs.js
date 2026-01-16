import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = API_BASE_URL;

export const useSystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("player_info");

    if (!token || !userStr) return;

    const user = JSON.parse(userStr);

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/logs/timeline`, {
        params: { userId: user._id, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
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

      // Show all logs to ensure user sees their submission
      // const diaryLogs = allLogs.filter((log) => log.category === "USER_LOG");
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

  const addLog = async (content, type) => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
      await axios.post(
        `${API_URL}/logs/commit`,
        {
          content,
          status: "STABLE", // Default status for user logs (must match backend enum)
          category: "USER_LOG",
          type: type || "NOTE", // The selected type (NOTE, TODO, etc.)
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchLogs(); // Refresh list immediately
      return true;
    } catch (err) {
      console.error("Failed to add log", err);
      return false;
    }
  };

  const deleteLog = (id) => {
    // 暂未实现后端删除接口
    console.warn("Delete API not available");
  };

  return {
    logs,
    loading,
    addLog,
    deleteLog,
    refreshLogs: fetchLogs,
  };
};
