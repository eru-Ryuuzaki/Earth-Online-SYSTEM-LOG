import React, { useState } from "react";
import { X, Save } from "lucide-react";

const SettingsPanel = ({ playerStats, onUpdateBirthday, onClose }) => {
  const [birthday, setBirthday] = useState(playerStats.birthday);

  const handleSave = () => {
    onUpdateBirthday(birthday);
    onClose();
  };

  return (
    <div className="max-w-7xl mx-auto mb-4">
      <div className="bg-black/60 backdrop-blur border border-cyan-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-cyan-400">Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Player Spawn Date (Birthday)
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full md:w-auto bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              This affects the Frame counter calculation (seconds since birth ×
              60 FPS)
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
