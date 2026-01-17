import React, { useState, useEffect } from "react";
import HUDStats from "./components/HUDStats";
import SettingsPanel from "./components/SettingsPanel";
import BiosBoot from "./components/BiosBoot";
import TerminalLogin from "./components/TerminalLogin";
import SystemLogModule from "./components/SystemLog/SystemLogModule";
import BirthdayModal from "./components/BirthdayModal";
import { useGameEngine } from "./hooks/useGameEngine";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const {
    isBooting,
    playerStats,
    setPlayerStats,
    buffs,
    debuffs,
    handleBootComplete,
    updateVitals,
  } = useGameEngine({
    hp: 85,
    maxHp: 100,
    mental: 72,
    maxMental: 100,
    coins: 12847,
    exp: 7580,
    level: 25,
    birthday: null,
    expectedLifespan: 100,
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const savedPlayer = JSON.parse(localStorage.getItem("player_info") || "{}");

    if (token) {
      setIsAuthenticated(true);
      if (savedPlayer.username) setUsername(savedPlayer.username);
      if (savedPlayer.birthday) {
        setPlayerStats((prev) => ({
          ...prev,
          birthday: savedPlayer.birthday,
          expectedLifespan:
            savedPlayer.expectedLifespan !== undefined
              ? savedPlayer.expectedLifespan
              : 100,
        }));
      }
    }
  }, []);

  const handleLoginSuccess = (playerData) => {
    if (playerData) {
      setUsername(playerData.username);
      setPlayerStats((prev) => ({
        ...prev,
        hp: playerData.hp || prev.hp,
        maxHp: playerData.maxHp || prev.maxHp,
        mental: playerData.mental || prev.mental,
        coins: playerData.coins || prev.coins,
        level: playerData.level || prev.level,
        exp: playerData.exp || prev.exp,
        birthday: playerData.birthday || null,
        expectedLifespan:
          playerData.expectedLifespan !== undefined
            ? playerData.expectedLifespan
            : prev.expectedLifespan || 100,
      }));
    }
    setIsAuthenticated(true);
  };

  const handleUpdateBirthday = (data) => {
    // Check if data is just a string (old behavior) or object
    if (typeof data === "string") {
      setPlayerStats((prev) => ({ ...prev, birthday: data }));
    } else if (data && typeof data === "object") {
      setPlayerStats((prev) => ({
        ...prev,
        birthday: data.birthday,
        expectedLifespan:
          data.expectedLifespan !== undefined
            ? data.expectedLifespan
            : prev.expectedLifespan,
      }));
    }
  };

  const getPlayerAge = () => {
    if (!playerStats.birthday) return "UNKNOWN";
    const birthday = new Date(playerStats.birthday);
    const today = new Date();
    const diffTime = Math.abs(today - birthday);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    return diffYears;
  };

  const getSecondsSinceBirth = () => {
    if (!playerStats.birthday) return 0;
    const birthday = new Date(playerStats.birthday);
    const now = new Date();
    return Math.floor((now - birthday) / 1000);
  };

  const [logsUpdated, setLogsUpdated] = useState(0); // Trigger for refreshing logs in HUD

  const handleLogAdded = () => {
    setLogsUpdated((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return <TerminalLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white p-6 font-mono overflow-hidden flex flex-col">
      {isAuthenticated && !isBooting && !playerStats.birthday && (
        <BirthdayModal username={username} onComplete={handleUpdateBirthday} />
      )}

      {isBooting && <BiosBoot onComplete={handleBootComplete} />}

      <div
        className={`transition-opacity duration-1000 flex flex-col h-full ${
          isBooting ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Top HUD */}
        <div className="shrink-0">
          <HUDStats
            playerStats={playerStats}
            getPlayerAge={getPlayerAge}
            refreshTrigger={logsUpdated}
            onLogClick={setSelectedLog}
          />
        </div>

        {/* Main Workspace: System Log Module */}
        <div className="flex-1 min-h-0 flex flex-col">
          <SystemLogModule
            onToggleSettings={() => setShowSettings(true)}
            playerStats={playerStats}
            onUpdateVitals={updateVitals}
            onLogAdded={handleLogAdded}
            selectedLog={selectedLog}
            onSelectLog={setSelectedLog}
          />
        </div>

        {/* Settings Overlay */}
        {showSettings && (
          <SettingsPanel
            playerStats={playerStats}
            onUpdateBirthday={handleUpdateBirthday}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
