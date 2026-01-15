import React, { useState } from "react";
import { X, Save } from "lucide-react";

const SettingsPanel = ({ playerStats, onUpdateBirthday, onClose }) => {
  const [birthday, setBirthday] = useState(playerStats.birthday);

  const handleSave = () => {
    onUpdateBirthday(birthday);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-gray-950 border border-cyan-500/30 rounded-xl shadow-[0_0_40px_rgba(8,145,178,0.2)] p-6 relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 border-b border-cyan-900/30 pb-4">
          <h3 className="text-xl font-bold text-cyan-400 tracking-wide">SYSTEM SETTINGS</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
              Player Spawn Date (Birthday)
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Adjusts global frame counter synchronization.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-cyan-900/30">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              SAVE CONFIG
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
