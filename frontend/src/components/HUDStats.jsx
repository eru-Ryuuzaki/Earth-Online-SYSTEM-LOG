import React, { useState, useEffect } from "react";
import {
  Heart,
  Brain,
  Database,
  Activity,
  Zap,
  Cake,
  Clock,
  Plus
} from "lucide-react";
import HeartbeatWave from "./HeartbeatWave";

const HUDStats = ({
  playerStats,
  buffs,
  debuffs,
}) => {
  const [runtime, setRuntime] = useState({ s: 0, f: 0 });

  useEffect(() => {
    const calculateRuntime = () => {
      const now = new Date();
      const birthDate = new Date(playerStats.birthday);
      const diffSeconds = Math.floor((now - birthDate) / 1000);
      setRuntime({
        s: diffSeconds,
        f: diffSeconds * 60 // Assuming 60fps life simulation
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
                {playerStats.birthday}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* COL 1: Vitals (HP/Mental) */}
          <div className="space-y-4">
            {/* HP -> Physical Health */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-bold text-gray-300">PHYSICAL INTEGRITY</span>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {playerStats.hp}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-red-900/30 relative group">
                <div
                  className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 transition-all duration-1000 relative"
                  style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
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
                  <span className="text-sm font-bold text-gray-300">MENTAL STABILITY</span>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {playerStats.mental}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-blue-900/30 relative">
                <div
                  className="h-full bg-gradient-to-r from-blue-900 via-blue-600 to-blue-500 transition-all duration-1000 relative"
                  style={{ width: `${(playerStats.mental / playerStats.maxMental) * 100}%` }}
                >
                    <div className="absolute top-0 right-0 h-full w-1 bg-white/50 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: Metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-800/30 rounded p-3 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded">
                    <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Experience</div>
                    <div className="text-sm font-mono text-purple-300">{playerStats.exp} XP</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-gray-800/30 rounded p-3 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded">
                    <Database className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Data Fragments</div>
                    <div className="text-sm font-mono text-yellow-300">{playerStats.coins.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div className="h-8 overflow-hidden rounded bg-black/20 border border-cyan-500/10 relative">
                <HeartbeatWave color="#06b6d4" height={32} />
                <div className="absolute top-0 right-2 h-full flex items-center">
                    <span className="text-[10px] text-cyan-500 animate-pulse">SYSTEM MONITORING</span>
                </div>
            </div>
          </div>

          {/* COL 3: Active Status Effects (Combined Buffs/Debuffs) */}
          <div className="bg-black/20 rounded border border-white/5 p-3 flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-400 font-bold flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    ACTIVE STATUS
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                    <Plus className="w-3 h-3" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 max-h-[100px] pr-1">
                {[...buffs, ...debuffs].length === 0 && (
                    <div className="text-xs text-gray-600 italic text-center py-4">No active status effects.</div>
                )}
                
                {buffs.map((buff) => (
                    <div key={`b-${buff.id}`} className="bg-green-500/10 border border-green-500/20 rounded px-2 py-1 flex justify-between items-center group cursor-pointer hover:bg-green-500/20 transition-colors">
                        <span className="text-xs text-green-300">{buff.name}</span>
                        <span className="text-[10px] text-green-500/50 group-hover:text-green-400">{buff.duration}</span>
                    </div>
                ))}
                {debuffs.map((debuff) => (
                    <div key={`d-${debuff.id}`} className="bg-red-500/10 border border-red-500/20 rounded px-2 py-1 flex justify-between items-center group cursor-pointer hover:bg-red-500/20 transition-colors">
                        <span className="text-xs text-red-300">{debuff.name}</span>
                        <span className="text-[10px] text-red-500/50 group-hover:text-red-400">{debuff.duration}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUDStats;
