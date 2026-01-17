import React, { useState, useEffect } from "react";
import { Heart, Brain, Activity, Cake, Clock } from "lucide-react";
import LogCalendar from "./LogCalendar";
import { useSystemLogs } from "../hooks/useSystemLogs";

const HUDStats = ({ playerStats, buffs, debuffs, refreshTrigger }) => {
  const [runtime, setRuntime] = useState({ s: 0, f: 0 });
  const { logs, refreshLogs } = useSystemLogs();

  useEffect(() => {
    refreshLogs();
  }, [refreshTrigger]);

  useEffect(() => {
    const calculateRuntime = () => {
      const now = new Date();
      const birthDate = new Date(playerStats.birthday);
      const diffSeconds = Math.floor((now - birthDate) / 1000);
      setRuntime({
        s: diffSeconds,
        f: diffSeconds * 60, // Assuming 60fps life simulation
      });
    };

    calculateRuntime();
    const timer = setInterval(calculateRuntime, 1000); // Update every second is enough for seconds
    return () => clearInterval(timer);
  }, [playerStats.birthday]);

  const getPlayerAge = () => {
    const birthDate = new Date(playerStats.birthday);
    const now = new Date();
    const age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <div className="max-w-7xl mx-auto mb-6 px-4 md:px-0">
      <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-2xl">
        {/* Top Bar: Identity & Runtime */}
        <div className="mb-4 pb-3 border-b border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2" title="Spawn Date">
              <Cake className="w-4 h-4 text-pink-400" />
              <span className="text-cyan-400 font-mono">
                {new Date(playerStats.birthday).toLocaleDateString()}
              </span>
            </div>
            <div className="w-px h-4 bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Level:</span>
              <span className="text-purple-400 font-bold">
                {getPlayerAge()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-mono bg-black/30 px-3 py-1 rounded border border-white/5">
            <Clock className="w-3.5 h-3.5 text-green-400" />
            <span className="text-gray-400">RUNTIME:</span>
            <span className="text-green-400">
              {runtime.s.toLocaleString()}s
            </span>
            <span className="text-green-600 text-xs">
              [{runtime.f.toLocaleString()}f]
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* COL 1: Vitals (HP/Mental/Experience) */}
          <div className="space-y-3">
            {/* HP -> Physical Health */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-bold text-gray-300">
                    PHYSICAL INTEGRITY
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {playerStats.hp}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-red-900/30 relative group">
                <div
                  className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 transition-all duration-1000 relative"
                  style={{
                    width: `${(playerStats.hp / playerStats.maxHp) * 100}%`,
                  }}
                >
                  <div className="absolute top-0 right-0 h-full w-1 bg-white/50 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Mental -> Mental Stability */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-gray-300">
                    MENTAL STABILITY
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {playerStats.mental}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-blue-900/30 relative">
                <div
                  className="h-full bg-gradient-to-r from-blue-900 via-blue-600 to-blue-500 transition-all duration-1000 relative"
                  style={{
                    width: `${
                      (playerStats.mental / playerStats.maxMental) * 100
                    }%`,
                  }}
                >
                  <div className="absolute top-0 right-0 h-full w-1 bg-white/50 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Experience (Moved from Col 2) */}
            <div className="flex items-center justify-between bg-gray-800/30 rounded p-3 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded">
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">
                    Experience
                  </div>
                  <div className="text-sm font-mono text-purple-300">
                    {playerStats.exp} XP
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: Calendar */}
          <div className="h-full">
            <LogCalendar logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUDStats;
