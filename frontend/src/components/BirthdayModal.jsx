import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const BirthdayModal = ({ username, onComplete }) => {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.patch(
        `${API_BASE_URL}/player/${username}/profile`,
        { birthday: date },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update local storage if needed, but mainly notify parent
      const playerInfo = JSON.parse(localStorage.getItem("player_info") || "{}");
      playerInfo.birthday = date;
      localStorage.setItem("player_info", JSON.stringify(playerInfo));

      onComplete(date);
    } catch (err) {
      console.error(err);
      setError("Failed to initialize timeline. Server rejected value.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.5)]">
        <div className="bg-gray-900 p-6 rounded text-center">
          <h2 className="text-2xl font-bold text-cyan-400 mb-2 tracking-wider">
            IDENTITY INITIALIZATION
          </h2>
          <p className="text-gray-400 mb-6 text-sm font-mono border-b border-gray-800 pb-4">
            [SYSTEM ALERT]: Temporal anchor missing.
            <br />
            Please specify your point of origin (Date of Birth).
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 p-2 mb-4 text-xs font-mono">
              [ERROR]: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-left text-xs text-cyan-600 mb-1 font-mono">
                DATE_OF_BIRTH (YYYY-MM-DD)
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black border border-cyan-800 text-cyan-300 p-3 font-mono focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 mt-2 font-mono font-bold tracking-widest text-black transition-all ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]"
              }`}
            >
              {loading ? "INITIALIZING..." : "CONFIRM TIMELINE"}
            </button>
          </form>
          
          <div className="mt-4 text-[10px] text-gray-600 font-mono">
            SECURE PROTOCOL V2.4 // ENCRYPTED CONNECTION
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayModal;
