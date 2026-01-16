import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { logTemplates } from "../../data/logTemplates";
import { calculateFrame } from "../../utils/logGenerator";
import LogFormTypeSelector from "../LogFormTypeSelector";
import LogFormMessage from "../LogFormMessage";
import LogFormIcon from "../LogFormIcon";

const WEATHER_OPTS = ["☀️", "☁️", "🌧️", "⛈️", "❄️", "🌪️", "🌫️", "🌑"];
const MOOD_OPTS = ["😊", "😐", "😢", "😡", "🤔", "😴", "🤩", "🤯", "🧘"];

const SystemLogCreate = ({ onCancel, onSave, playerStats }) => {
  const [category, setCategory] = useState("system");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [type, setType] = useState("INFO");
  const [message, setMessage] = useState(""); // Short Summary
  const [detailContent, setDetailContent] = useState(""); // Detailed Diary
  const [icon, setIcon] = useState("📝");
  const [isCustomMessage, setIsCustomMessage] = useState(false);
  const [isCustomIcon, setIsCustomIcon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Metadata
  const [weather, setWeather] = useState("☀️");
  const [mood, setMood] = useState("😐");
  const [energy, setEnergy] = useState(80);

  // Live Data
  const [currentTime, setCurrentTime] = useState("");
  const [currentFrame, setCurrentFrame] = useState(0);

  const categories = Object.keys(logTemplates);
  const availableTemplates = logTemplates[category] || [];
  const availableTypes = [...new Set(availableTemplates.map((t) => t.type))];
  const filteredTemplates = availableTemplates.filter((t) => t.type === type);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0");
      const timeStr =
        now.toTimeString().split(" ")[0] +
        "." +
        now.getMilliseconds().toString().padStart(3, "0");
      setCurrentTime(`${dateStr} ${timeStr}`);
      if (playerStats?.birthday) {
        setCurrentFrame(Math.floor(calculateFrame(playerStats.birthday)));
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 50);
    return () => clearInterval(timer);
  }, [playerStats]);

  useEffect(() => {
    const templates = logTemplates[category] || [];
    const types = [...new Set(templates.map((t) => t.type))];
    if (types.length > 0) {
      setType(types[0]);
    }
    setSelectedTemplate(null);
    setIsCustomMessage(false);
    setIsCustomIcon(false);
    setMessage("");
    setIcon("📝");
  }, [category]);

  useEffect(() => {
    setSelectedTemplate(null);
    setIsCustomMessage(false);
    setIsCustomIcon(false);
    setMessage("");
    setIcon("📝");
  }, [type]);

  const handleTemplateSelect = (e) => {
    const templateIndex = e.target.value;
    if (templateIndex === "custom") {
      setSelectedTemplate(null);
      setIsCustomMessage(true);
      setMessage("");
    } else {
      const template = filteredTemplates[parseInt(templateIndex)];
      setSelectedTemplate(template);
      setMessage(template.msg);
      setIcon(template.icon);
      setIsCustomMessage(false);
      setIsCustomIcon(false);
    }
  };

  const sysTrace = `[${currentTime}][Frame ${currentFrame}][${category.toUpperCase()}]${type}: ${icon} ${
    message || "..."
  }`;

  const handleSubmit = () => {
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const payload = JSON.stringify({
      sysTrace: `[${currentTime}][Frame ${currentFrame}][${category.toUpperCase()}]${type}: ${icon} ${message}`,
      body: detailContent,
      metadata: { weather, mood, energy },
    });

    setTimeout(() => {
      onSave(payload, type);
      setIsSubmitting(false);
    }, 800);
  };

  const commonIcons = [
    "📝",
    "✅",
    "❌",
    "⚠️",
    "💡",
    "🎯",
    "🔥",
    "⚡",
    "💰",
    "❤️",
    "🎮",
    "🌟",
    "🚀",
    "💪",
    "🎉",
    "😊",
    "😢",
    "😡",
    "🤔",
    "💀",
  ];

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-right duration-300 p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-cyan-500/20 pb-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-cyan-500 tracking-wider">
            NEW SYSTEM LOG
          </h2>
          <div className="flex gap-4 text-xs font-mono text-cyan-500/60 mt-1">
            <span>Mode: RICH LOGGING</span>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-8">
        {/* SECTION 1: KERNEL TRACE */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/20 pb-2">
            <span className="text-cyan-500 font-bold text-xs">01</span>
            <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">
              KERNEL TRACE CONFIG
            </label>
          </div>

          {/* Live Preview */}
          <div className="bg-black/60 border border-cyan-500/50 p-3 rounded font-mono text-[10px] text-cyan-300 break-all shadow-[0_0_15px_rgba(6,182,212,0.1)] relative group">
            <div
              className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"
              title="Live Recording"
            ></div>
            {sysTrace}
          </div>

          <LogFormTypeSelector
            categories={categories}
            category={category}
            setCategory={setCategory}
            availableTypes={availableTypes}
            type={type}
            setType={setType}
          />

          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div className="flex-1">
              <LogFormMessage
                filteredTemplates={filteredTemplates}
                selectedTemplate={selectedTemplate}
                handleTemplateSelect={handleTemplateSelect}
                message={message}
                setMessage={setMessage}
                setIsCustomMessage={setIsCustomMessage}
              />
            </div>
            <div className="w-16 pt-7">
              <div className="text-center text-xs text-gray-500 mb-1">Icon</div>
              <div className="flex justify-center">
                <button
                  className="w-10 h-10 text-xl bg-gray-800 border border-gray-700 rounded hover:border-cyan-500 transition-colors"
                  onClick={() => setIsCustomIcon(!isCustomIcon)}
                >
                  {icon}
                </button>
              </div>
            </div>
          </div>

          {isCustomIcon && (
            <LogFormIcon
              icon={icon}
              setIcon={setIcon}
              setIsCustomIcon={setIsCustomIcon}
              commonIcons={commonIcons}
            />
          )}
        </div>

        {/* SECTION 2: VITALS */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/20 pb-2">
            <span className="text-cyan-500 font-bold text-xs">02</span>
            <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">
              ENVIRONMENTAL VITALS
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Weather */}
            <div className="bg-black/20 p-3 rounded border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase mb-2">
                Weather Condition
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
              <div className="text-[10px] text-gray-500 uppercase mb-2">
                Operator Mood
              </div>
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`text-lg p-1 rounded hover:bg-white/10 ${
                      mood === m
                        ? "bg-white/20 ring-1 ring-cyan-500"
                        : "opacity-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div className="bg-black/20 p-3 rounded border border-white/5 col-span-2 md:col-span-1">
              <div className="text-[10px] text-gray-500 uppercase mb-2 flex justify-between">
                <span>Energy Level</span>
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

        {/* SECTION 3: DIARY */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/20 pb-2">
            <span className="text-cyan-500 font-bold text-xs">03</span>
            <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">
              DETAILED LOG (OPTIONAL)
            </label>
          </div>
          <textarea
            value={detailContent}
            onChange={(e) => setDetailContent(e.target.value)}
            className="w-full h-48 bg-black/40 border border-gray-800 rounded p-4 text-gray-300 font-mono placeholder-gray-700 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all resize-none text-sm leading-relaxed"
            placeholder="Record detailed observations, thoughts, or system anomalies..."
          />
        </div>

        <div className="flex justify-end pt-6 pb-8">
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isSubmitting}
            className={`
            px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-sm rounded transition-all shadow-lg shadow-cyan-900/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isSubmitting ? "animate-pulse" : ""}
            `}
          >
            {isSubmitting ? "UPLOADING TRACE..." : "COMMIT LOG ENTRY"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemLogCreate;
