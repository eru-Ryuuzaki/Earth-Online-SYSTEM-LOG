import React, { useState, useEffect } from "react";
import { Heart, Brain, Activity, Cake, Clock, Zap, Wifi } from "lucide-react";
import LogCalendar from "./LogCalendar";
import { useSystemLogs } from "../hooks/useSystemLogs";

const HUDStats = ({
  playerStats,
  buffs,
  debuffs,
  refreshTrigger,
  getPlayerAge,
  onLogClick,
}) => {
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

  const getLifeProgress = () => {
    if (!playerStats.birthday || !playerStats.expectedLifespan) return null;
    const age = getPlayerAge();
    const total = parseInt(playerStats.expectedLifespan);
    if (isNaN(total) || total <= 0) return null;
    return Math.min(100, Math.max(0, (age / total) * 100));
  };

  const getRemainingTime = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const endOfMonth = new Date(currentYear, now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const endOfYear = new Date(currentYear, 11, 31);
    endOfYear.setHours(23, 59, 59, 999);

    const diffDays = (target) =>
      Math.ceil((target - now) / (1000 * 60 * 60 * 24));

    // Calculate weeks remaining in year
    // Simple approx: days remaining / 7
    const daysLeftInYear = diffDays(endOfYear);
    const weeksLeftInYear = Math.ceil(daysLeftInYear / 7);

    return {
      week: diffDays(endOfWeek),
      month: diffDays(endOfMonth),
      year: daysLeftInYear,
      yearWeeks: weeksLeftInYear,
    };
  };

  const remaining = getRemainingTime();
  const lifeProgress = getLifeProgress();

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
          {/* COL 1: Vitals & Time Dilation */}
          <div className="space-y-4">
            {/* Vitals Grid */}
            <div className="grid grid-cols-1 gap-3">
              {/* Energy -> Kinetic Energy */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-[10px] font-bold text-gray-300">
                      KINETIC
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {playerStats.energy || 80}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden border border-yellow-900/30">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-900 via-yellow-500 to-yellow-400 transition-all duration-1000"
                    style={{ width: `${playerStats.energy || 80}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* TEMPORAL METRICS (Countdown) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/30 border border-white/5 p-4 rounded text-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Week Remaining
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {remaining.week}
                </div>
                <div className="text-[9px] text-gray-600 mt-1">Days</div>
              </div>
              <div className="bg-gray-800/30 border border-white/5 p-4 rounded text-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Month Remaining
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {remaining.month}
                </div>
                <div className="text-[9px] text-gray-600 mt-1">Days</div>
              </div>
              <div className="bg-gray-800/30 border border-white/5 p-4 rounded text-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Year Remaining
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {remaining.year}
                </div>
                <div className="text-[9px] text-gray-600 mt-1">Days</div>
              </div>
              <div className="bg-gray-800/30 border border-white/5 p-4 rounded text-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Year Weeks
                </div>
                <div className="text-2xl font-mono font-bold text-cyan-400">
                  {remaining.yearWeeks}
                </div>
                <div className="text-[9px] text-gray-600 mt-1">Weeks</div>
              </div>
            </div>

            {/* LIFE PROGRESS (Optional) */}
            {lifeProgress !== null && (
              <div className="bg-black/20 p-3 rounded border border-white/5 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-1 relative z-10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-500" />
                    SESSION_LENGTH
                  </span>
                  <span className="text-[10px] font-mono text-gray-300">
                    {lifeProgress.toFixed(1)}% / {playerStats.expectedLifespan}Y
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative z-10">
                  <div
                    className="h-full bg-gradient-to-r from-gray-600 via-gray-400 to-white transition-all duration-1000"
                    style={{ width: `${lifeProgress}%` }}
                  ></div>
                </div>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-red-500/5 to-transparent pointer-events-none"></div>
              </div>
            )}
          </div>

          {/* COL 2: Calendar */}
          <div className="h-full">
            <LogCalendar logs={logs} onLogClick={onLogClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUDStats;
