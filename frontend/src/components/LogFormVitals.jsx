import React from "react";
import { useTranslation } from "react-i18next";

const WEATHER_OPTS = ["☀️", "☁️", "🌧️", "⛈️", "❄️", "🌪️", "🌫️", "🌑"];
const MOOD_OPTS = ["😊", "😐", "😢", "😡", "🤔", "😴", "🤩", "🤯", "🧘"];

const LogFormVitals = ({
  weather,
  setWeather,
  mood,
  setMood,
  energy,
  setEnergy,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/30 pb-2">
        <span className="text-cyan-400 font-bold text-xs">02</span>
        <label className="text-xs font-bold text-gray-400 tracking-widest uppercase">
          {t("logs.environmental_vitals")}
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Weather */}
        <div className="bg-black/40 p-3 rounded border border-white/10">
          <div className="text-[10px] text-gray-300 font-bold uppercase mb-2 tracking-wider">
            {t("logs.weather")}
          </div>
          <div className="flex flex-wrap gap-2">
            {WEATHER_OPTS.map((w) => (
              <button
                key={w}
                onClick={() => setWeather(w)}
                className={`text-lg p-1 rounded hover:bg-white/10 ${
                  weather === w
                    ? "bg-white/20 ring-1 ring-cyan-500"
                    : "opacity-50"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className="bg-black/20 p-3 rounded border border-white/5">
          <div className="text-[10px] text-gray-300 font-bold uppercase mb-2 tracking-wider">
            {t("logs.mood")}
          </div>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`text-lg p-1 rounded hover:bg-white/10 ${
                  mood === m ? "bg-white/20 ring-1 ring-cyan-500" : "opacity-50"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="bg-black/20 p-3 rounded border border-white/5 col-span-2 md:col-span-1">
          <div className="text-[10px] text-gray-300 font-bold uppercase mb-2 flex justify-between tracking-wider">
            <span>{t("logs.energy")}</span>
            <span className="text-cyan-400">{energy}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
    </div>
  );
};

export default LogFormVitals;
