import React, { useState, useEffect } from "react";
import HUDStats from "./components/HUDStats";
import SettingsPanel from "./components/SettingsPanel";
import BiosBoot from "./components/BiosBoot";
import TerminalLogin from "./components/TerminalLogin";
import SystemLogModule from "./components/SystemLog/SystemLogModule";
import { useGameEngine } from "./hooks/useGameEngine";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    isBooting,
    playerStats,
    setPlayerStats,
    buffs,
    debuffs,
    handleBootComplete,
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
      }));
    }
    setIsAuthenticated(true);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white p-6 font-mono overflow-hidden flex flex-col">
      {isBooting && <BiosBoot onComplete={handleBootComplete} />}

      <div
        className={`transition-opacity duration-1000 flex flex-col h-full ${
          isBooting ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Top HUD */}
        <div className="mb-8 shrink-0">
          <HUDStats
            playerStats={playerStats}
            buffs={buffs}
            debuffs={debuffs}
            getPlayerAge={getPlayerAge}
            getSecondsSinceBirth={getSecondsSinceBirth}
          />
        </div>

        {/* Main Workspace: System Log Module */}
        <div className="flex-1 min-h-0 flex flex-col">
          <SystemLogModule
            onToggleSettings={() => setShowSettings(true)}
            playerStats={playerStats}
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
