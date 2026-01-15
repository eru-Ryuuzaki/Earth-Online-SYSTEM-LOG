import React from "react";
import {
  Heart,
  Brain,
  Coins,
  Activity,
  TrendingUp,
  TrendingDown,
  Cake,
} from "lucide-react";
import HeartbeatWave from "./HeartbeatWave";

const HUDStats = ({
  playerStats,
  buffs,
  debuffs,
  getPlayerAge,
  getSecondsSinceBirth,
}) => {
  return (
    <div className="max-w-7xl mx-auto mb-6">
      <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-2xl">
        {/* 玩家生日信息 */}
        <div className="mb-4 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Cake className="w-4 h-4 text-pink-400" />
              <span className="text-gray-400">Spawn Date:</span>
              <span className="text-cyan-400 font-mono">
                {playerStats.birthday}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Age Level:</span>
              <span className="text-purple-400 font-bold">
                {getPlayerAge()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Runtime:</span>
              <span className="text-green-400 font-mono">
                {getSecondsSinceBirth().toLocaleString()}s (
                {(getSecondsSinceBirth() * 60).toLocaleString()} frames)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 左侧：生命值和精神值 */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-bold">HP</span>
                </div>
                <span className="text-xs text-gray-400">
                  {playerStats.hp}/{playerStats.maxHp}
                </span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-red-900/50">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                  style={{
                    width: `${(playerStats.hp / playerStats.maxHp) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold">Mental</span>
                </div>
                <span className="text-xs text-gray-400">
                  {playerStats.mental}/{playerStats.maxMental}
                </span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-blue-900/50">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                  style={{
                    width: `${
                      (playerStats.mental / playerStats.maxMental) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 中间：等级和金币 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-800/50 rounded p-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-bold">
                  Level {playerStats.level}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {playerStats.exp}/10000 XP
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-800/50 rounded p-2">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-bold">Coins</span>
              </div>
              <span className="text-yellow-400 font-mono">
                {playerStats.coins.toLocaleString()}
              </span>
            </div>
            
            {/* 实时波形监控 */}
            <HeartbeatWave color="#06b6d4" height={50} />
          </div>

          {/* 右侧：Buffs 和 Debuffs */}
          <div className="space-y-2">
            <div>
              <div className="text-xs text-green-400 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> BUFFS
              </div>
              {buffs.map((buff) => (
                <div
                  key={buff.id}
                  className="bg-green-900/20 border border-green-500/30 rounded px-2 py-1 mb-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      {buff.icon} {buff.name}
                    </span>
                    <span className="text-gray-400">{buff.duration}</span>
                  </div>
                  <div className="text-xs text-green-300">{buff.effect}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs text-red-400 mb-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> DEBUFFS
              </div>
              {debuffs.map((debuff) => (
                <div
                  key={debuff.id}
                  className="bg-red-900/20 border border-red-500/30 rounded px-2 py-1 mb-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      {debuff.icon} {debuff.name}
                    </span>
                    <span className="text-gray-400">{debuff.duration}</span>
                  </div>
                  <div className="text-xs text-red-300">{debuff.effect}</div>
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
