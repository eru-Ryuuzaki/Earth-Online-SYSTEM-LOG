import React, { useState, useEffect, useRef } from "react";
import { Clock, Settings, Plus, Book } from "lucide-react";
import HUDStats from "./components/HUDStats";
import LogTimeline from "./components/LogTimeline";
import LogForm from "./components/LogForm";
import SettingsPanel from "./components/SettingsPanel";
import SystemLogModule from "./components/SystemLog/SystemLogModule";
import BiosBoot from "./components/BiosBoot";
import TerminalLogin from "./components/TerminalLogin";
import { generateLog, calculateFrame } from "./utils/logGenerator";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isBooting, setIsBooting] = useState(true);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemLog, setShowSystemLog] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    hp: 85,
    maxHp: 100,
    mental: 72,
    maxMental: 100,
    coins: 12847,
    exp: 7580,
    level: 25,
    birthday: "2000-01-01",
  });
  const [buffs, setBuffs] = useState([]);
  const [debuffs, setDebuffs] = useState([]);
  const [collapsedMonths, setCollapsedMonths] = useState({});
  const [collapsedYears, setCollapsedYears] = useState({});
  const logsEndRef = useRef(null);
  const autoGenerateInterval = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (playerData) => {
    if (playerData) {
      setPlayerStats((prev) => ({
        ...prev,
        hp: playerData.hp || prev.hp,
        maxHp: playerData.maxHp || prev.maxHp,
        mental: playerData.mental || prev.mental,
        coins: playerData.coins || prev.coins,
        level: playerData.level || prev.level,
        exp: playerData.exp || prev.exp,
        // Keep birthday as is or update if backend provides
      }));
    }
    setIsAuthenticated(true);
  };

  const getPlayerAge = () => {
    const birthday = new Date(playerStats.birthday);
    const today = new Date();
    const diffTime = Math.abs(today - birthday);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    return diffYears;
  };

  const getSecondsSinceBirth = () => {
    const birthday = new Date(playerStats.birthday);
    const now = new Date();
    return Math.floor((now - birthday) / 1000);
  };

  // Handle Boot Completion
  const handleBootComplete = () => {
    setIsBooting(false);
    const now = new Date();
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        timestamp:
          now.toTimeString().split(" ")[0] +
          "." +
          now.getMilliseconds().toString().padStart(3, "0"),
        date: now.toISOString().split("T")[0],
        frame: calculateFrame(playerStats.birthday),
        type: "SUCCESS",
        category: "system",
        message: "System initialized. Welcome back, Player.",
        icon: "✓",
        fullDate: now,
      },
    ]);

    // Set initial buffs/debuffs
    setBuffs([
      {
        id: 1,
        name: "Well Rested",
        duration: "3:45:20",
        effect: "+20% XP",
        icon: "✨",
      },
      {
        id: 2,
        name: "Coffee Boost",
        duration: "0:28:15",
        effect: "+15 Mental/min",
        icon: "☕",
      },
    ]);
    setDebuffs([
      {
        id: 1,
        name: "Sleep Debt",
        duration: "∞",
        effect: "-5% Max HP",
        icon: "😴",
      },
    ]);
  };

  // 自动生成日志
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

  // 自动滚动
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleAddLog = (logData) => {
    const now = new Date();
    const newLog = {
      id: Date.now() + Math.random(),
      timestamp:
        now.toTimeString().split(" ")[0] +
        "." +
        now.getMilliseconds().toString().padStart(3, "0"),
      date: now.toISOString().split("T")[0],
      frame: calculateFrame(playerStats.birthday),
      type: logData.type,
      category: logData.category,
      message: logData.message,
      icon: logData.icon || "📝",
      fullDate: now,
    };
    setLogs((prev) => [...prev, newLog]);
    setShowLogForm(false);
  };

  const handleUpdateBirthday = (newBirthday) => {
    setPlayerStats((prev) => ({ ...prev, birthday: newBirthday }));
  };

  if (!isAuthenticated) {
    return <TerminalLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white p-6 font-mono">
      {isBooting && <BiosBoot onComplete={handleBootComplete} />}

      <div
        className={`transition-opacity duration-1000 ${
          isBooting ? "opacity-0" : "opacity-100"
        }`}
      >
        <HUDStats
          playerStats={playerStats}
          buffs={buffs}
          debuffs={debuffs}
          getPlayerAge={getPlayerAge}
          getSecondsSinceBirth={getSecondsSinceBirth}
        />

        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSystemLog(true)}
              className="flex items-center gap-2 bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-500/50 px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Book className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-cyan-100 font-bold tracking-wider">
                SYSTEM LOG
              </span>
            </button>

            <button
              onClick={() => setShowLogForm(!showLogForm)}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Log Entry
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                  className="w-4 h-4"
                />
                Auto Generate Logs
              </label>
            </div>
          </div>
        </div>

        {showSystemLog && (
          <SystemLogModule onClose={() => setShowSystemLog(false)} />
        )}

        {showSettings && (
          <SettingsPanel
            playerStats={playerStats}
            onUpdateBirthday={handleUpdateBirthday}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showLogForm && (
          <LogForm
            onSubmit={handleAddLog}
            onCancel={() => setShowLogForm(false)}
          />
        )}

        <LogTimeline
          logs={logs}
          collapsedMonths={collapsedMonths}
          collapsedYears={collapsedYears}
          setCollapsedMonths={setCollapsedMonths}
          setCollapsedYears={setCollapsedYears}
          logsEndRef={logsEndRef}
        />
      </div>
    </div>
  );
};

export default App;
