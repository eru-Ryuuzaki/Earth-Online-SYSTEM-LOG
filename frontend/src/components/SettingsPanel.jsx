import React, { useState } from "react";
import { X, Save, LogOut } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import ProfileForm from "./ProfileForm";

const SettingsPanel = ({
  playerStats,
  onUpdateBirthday,
  onClose,
  onLogout,
}) => {
  const [birthday, setBirthday] = useState(playerStats.birthday || "");
  const [lifespan, setLifespan] = useState(
    playerStats.expectedLifespan !== null &&
      playerStats.expectedLifespan !== undefined
      ? playerStats.expectedLifespan
      : ""
  );
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    let finalLifespan = null;
    if (lifespan) {
      const parsed = parseInt(lifespan);
      if (isNaN(parsed) || parsed < 1 || parsed > 150) {
        setError(
          "Invalid Temporal Horizon. Please enter a value between 1-150 or leave empty."
        );
        return;
      }
      finalLifespan = parsed;
    }

    try {
      const token = localStorage.getItem("access_token");
      // Use playerStats.username directly or fetch it if needed
      // Assuming username is not passed here but we can rely on parent's callback to handle API
      // OR we should call API here.
      // Looking at BirthdayModal, it calls API directly.
      // Looking at App.jsx, handleUpdateBirthday just updates state.
      // THIS IS THE ISSUE: SettingsPanel calls onUpdateBirthday which only updates local state.
      // It does NOT call the backend.
      // BirthdayModal DOES call the backend.

      // We need to call the API here to persist changes.
      // However, SettingsPanel doesn't have the username prop.
      // We should check if we can get it from playerStats (not there) or localStorage.

      const storedPlayer = JSON.parse(
        localStorage.getItem("player_info") || "{}"
      );
      const username = storedPlayer.username;

      if (username && token) {
        await axios.patch(
          `${API_BASE_URL}/player/${username}/profile`,
          { birthday, expectedLifespan: finalLifespan },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Update local storage to persist across reloads immediately
        storedPlayer.birthday = birthday;
        storedPlayer.expectedLifespan = finalLifespan;
        localStorage.setItem("player_info", JSON.stringify(storedPlayer));
      }

      onUpdateBirthday({
        birthday,
        expectedLifespan: finalLifespan,
      });
      onClose();
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save configuration. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-gray-950 border border-cyan-500/30 rounded-xl shadow-[0_0_40px_rgba(8,145,178,0.2)] p-6 relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 border-b border-cyan-900/30 pb-4">
          <h3 className="text-xl font-bold text-cyan-400 tracking-wide">
            SYSTEM SETTINGS
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ProfileForm
          birthday={birthday}
          setBirthday={setBirthday}
          lifespan={lifespan}
          setLifespan={setLifespan}
          error={error}
        />

        <div className="flex gap-3 pt-8 border-t border-cyan-900/30 mt-6">
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

        {/* Danger Zone: Logout */}
        <div className="mt-6 pt-4 border-t border-red-900/20">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to disconnect?")) {
                onLogout();
              }
            }}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2 rounded transition-colors text-xs tracking-widest font-bold"
          >
            <LogOut className="w-3 h-3" />
            DISCONNECT SESSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
