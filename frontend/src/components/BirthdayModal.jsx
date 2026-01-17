import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import ProfileForm from "./ProfileForm";

const BirthdayModal = ({ username, onComplete }) => {
  const [date, setDate] = useState("");
  const [lifespan, setLifespan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    setError("");

    // Validate lifespan only if entered
    let finalLifespan = null;
    if (lifespan) {
      const parsed = parseInt(lifespan);
      if (isNaN(parsed) || parsed < 1 || parsed > 150) {
        setError(
          "Invalid Temporal Horizon. Please enter a value between 1-150 or leave empty."
        );
        setLoading(false);
        return;
      }
      finalLifespan = parsed;
    }

    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.patch(
        `${API_BASE_URL}/player/${username}/profile`,
        { birthday: date, expectedLifespan: finalLifespan },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local storage if needed, but mainly notify parent
      const playerInfo = JSON.parse(
        localStorage.getItem("player_info") || "{}"
      );
      playerInfo.birthday = date;
      playerInfo.expectedLifespan = finalLifespan;
      localStorage.setItem("player_info", JSON.stringify(playerInfo));

      onComplete({ birthday: date, expectedLifespan: finalLifespan });
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

          <form onSubmit={handleSubmit}>
            <ProfileForm
              birthday={date}
              setBirthday={setDate}
              lifespan={lifespan}
              setLifespan={setLifespan}
              error={error} // Pass error down to display in form if related to fields
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 mt-6 font-mono font-bold tracking-widest text-black transition-all rounded ${
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
