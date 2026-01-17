import React from "react";

const ProfileForm = ({
  birthday,
  setBirthday,
  lifespan,
  setLifespan,
  error,
}) => {
  return (
    <div className="space-y-6">
      {/* Birthday Input */}
      <div>
        <label className="block text-left text-xs md:text-sm font-bold text-cyan-600 md:text-gray-300 mb-1 md:mb-2 uppercase tracking-wider font-mono">
          Player Spawn Date (Birthday)
        </label>
        <input
          type="date"
          required
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-cyan-300 md:text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] font-mono"
        />
        <p className="text-[9px] md:text-xs text-gray-500 mt-2 font-mono text-left">
          * Adjusts global frame counter synchronization.
        </p>
      </div>

      {/* Lifespan Input */}
      <div className="border-t border-gray-800 pt-4">
        <label className="block text-left text-xs md:text-sm font-bold text-cyan-600 md:text-gray-300 mb-1 md:mb-2 uppercase tracking-wider font-mono">
          SESSION_LENGTH (OPTIONAL)
        </label>
        <input
          type="number"
          min="1"
          max="150"
          value={lifespan}
          onChange={(e) => setLifespan(e.target.value)}
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-cyan-300 md:text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-gray-700 font-mono"
          placeholder="Ex: 80 (Leave empty for unbounded)"
        />
        
        {error ? (
          <div className="text-xs text-red-400 mt-2 font-mono border-l-2 border-red-500 pl-2 text-left">
            [ERROR]: {error}
          </div>
        ) : (
          <p className="text-[9px] md:text-xs text-gray-500 mt-2 font-mono text-left italic">
            * Defines system warranty period. Leave blank to disable decay tracking.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
