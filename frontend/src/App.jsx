import React, { useState, useEffect, useRef } from "react";
import HUDStats from "./components/HUDStats";
import LogTimeline from "./components/LogTimeline";
import LogForm from "./components/LogForm";
import SettingsPanel from "./components/SettingsPanel";
import SystemLogModule from "./components/SystemLog/SystemLogModule";
import BiosBoot from "./components/BiosBoot";
import TerminalLogin from "./components/TerminalLogin";
import ActionBar from "./components/ActionBar";
import { useGameEngine } from "./hooks/useGameEngine";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemLog, setShowSystemLog] = useState(false);
  const [collapsedMonths, setCollapsedMonths] = useState({});
  const [collapsedYears, setCollapsedYears] = useState({});
  const logsEndRef = useRef(null);

  const {
    logs,
    setLogs,
    isBooting,
    autoGenerate,
    setAutoGenerate,
    playerStats,
    setPlayerStats,
    buffs,
    debuffs,
    handleBootComplete,
    addLog
  } = useGameEngine({
    hp: 85,
    maxHp: 100,
    mental: 72,
    maxMental: 100,
    coins: 12847,
    exp: 7580,
    level: 25,
    birthday: "2000-01-01",
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (playerData) => {
    if (playerData) {
        setPlayerStats(prev => ({
            ...prev,
            hp: playerData.hp || prev.hp,
            maxHp: playerData.maxHp || prev.maxHp,
            mental: playerData.mental || prev.mental,
            coins: playerData.coins || prev.coins,
            level: playerData.level || prev.level,
            exp: playerData.exp || prev.exp,
        }));
    }
    setIsAuthenticated(true);
  };

  // 自动滚动
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleAddLog = (logData) => {
    addLog(logData);
    setShowLogForm(false);
  };

  const handleUpdateBirthday = (newBirthday) => {
    setPlayerStats((prev) => ({ ...prev, birthday: newBirthday }));
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

  if (!isAuthenticated) {
    return <TerminalLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white p-6 font-mono">
      {isBooting && <BiosBoot onComplete={handleBootComplete} />}
      
      <div className={`transition-opacity duration-1000 ${isBooting ? 'opacity-0' : 'opacity-100'}`}>
        <HUDStats
          playerStats={playerStats}
          buffs={buffs}
          debuffs={debuffs}
          getPlayerAge={getPlayerAge}
          getSecondsSinceBirth={getSecondsSinceBirth}
        />

        <ActionBar
          onShowSystemLog={() => setShowSystemLog(true)}
          onToggleLogForm={() => setShowLogForm(!showLogForm)}
          onToggleSettings={() => setShowSettings(!showSettings)}
          autoGenerate={autoGenerate}
          setAutoGenerate={setAutoGenerate}
        />

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
