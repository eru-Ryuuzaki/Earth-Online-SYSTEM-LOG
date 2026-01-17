import React, { useState } from "react";
import { X, Save, LogOut, Globe } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import ProfileForm from "./ProfileForm";
import { useTranslation } from "react-i18next";

const SettingsPanel = ({
  playerStats,
  onUpdateBirthday,
  onClose,
  onLogout,
}) => {
  const { t, i18n } = useTranslation();
  const [birthday, setBirthday] = useState(playerStats.birthday || "");
  const [lifespan, setLifespan] = useState(
    playerStats.expectedLifespan !== null &&
      playerStats.expectedLifespan !== undefined
      ? playerStats.expectedLifespan
      : ""
  );
  const [error, setError] = useState("");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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
            {t("settings.title")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Language Switcher */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider font-mono flex items-center gap-2">
            <Globe className="w-3 h-3" />
            {t("settings.language")}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage("en")}
              className={`flex-1 py-2 rounded border font-mono text-sm transition-all ${
                i18n.language === "en"
                  ? "bg-cyan-900/40 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  : "bg-black border-gray-800 text-gray-500 hover:border-gray-600"
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("zh")}
              className={`flex-1 py-2 rounded border font-mono text-sm transition-all ${
                i18n.language === "zh"
                  ? "bg-cyan-900/40 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  : "bg-black border-gray-800 text-gray-500 hover:border-gray-600"
              }`}
            >
              中文 (Chinese)
            </button>
          </div>
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
            {t("settings.save_config")}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            {t("settings.cancel")}
          </button>
        </div>

        {/* Danger Zone: Logout */}
        <div className="mt-6 pt-4 border-t border-red-900/20">
          <button
            onClick={() => {
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2 rounded transition-colors text-xs tracking-widest font-bold"
          >
            <LogOut className="w-3 h-3" />
            {t("settings.disconnect_session")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
