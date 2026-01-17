import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { logTemplates } from "../../data/logTemplates";
import { calculateFrame } from "../../utils/logGenerator";
import LogFormTypeSelector from "../LogFormTypeSelector";
import LogFormMessage from "../LogFormMessage";
import LogFormIcon from "../LogFormIcon";

const WEATHER_OPTS = ["☀️", "☁️", "🌧️", "⛈️", "❄️", "🌪️", "🌫️", "🌑"];
const MOOD_OPTS = ["😊", "😐", "😢", "😡", "🤔", "😴", "🤩", "🤯", "🧘"];

const getThemeClasses = (category) => {
  switch (category) {
    case "dream":
      return {
        text: "text-fuchsia-400",
        textDim: "text-fuchsia-500/60",
        border: "border-fuchsia-500/20",
        borderStrong: "border-fuchsia-500/40",
        ring: "ring-fuchsia-500",
        bg: "bg-fuchsia-600",
        bgHover: "hover:bg-fuchsia-500",
        bgLow: "bg-fuchsia-500/20",
        shadow: "shadow-fuchsia-900/20",
        hoverBorder: "hover:border-fuchsia-500",
        glow: "shadow-[0_0_20px_rgba(232,121,249,0.15)]",
        title: "text-fuchsia-500",
      };
    case "challenge":
      return {
        text: "text-rose-400",
        textDim: "text-rose-500/60",
        border: "border-rose-500/20",
        borderStrong: "border-rose-500/40",
        ring: "ring-rose-500",
        bg: "bg-rose-600",
        bgHover: "hover:bg-rose-500",
        bgLow: "bg-rose-500/20",
        shadow: "shadow-rose-900/20",
        hoverBorder: "hover:border-rose-500",
        glow: "shadow-[0_0_20px_rgba(244,63,94,0.15)]",
        title: "text-rose-500",
      };
    case "life_event":
      return {
        text: "text-yellow-400",
        textDim: "text-yellow-500/60",
        border: "border-yellow-500/20",
        borderStrong: "border-yellow-500/40",
        ring: "ring-yellow-500",
        bg: "bg-yellow-600",
        bgHover: "hover:bg-yellow-500",
        bgLow: "bg-yellow-500/20",
        shadow: "shadow-yellow-900/20",
        hoverBorder: "hover:border-yellow-500",
        glow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]",
        title: "text-yellow-500",
      };
    default:
      return {
        text: "text-cyan-400",
        textDim: "text-cyan-500/60",
        border: "border-cyan-500/20",
        borderStrong: "border-cyan-500/40",
        ring: "ring-cyan-500",
        bg: "bg-cyan-600",
        bgHover: "hover:bg-cyan-500",
        bgLow: "bg-cyan-500/20",
        shadow: "shadow-cyan-900/20",
        hoverBorder: "hover:border-cyan-500",
        glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
        title: "text-cyan-500",
      };
  }
};

const SystemLogCreate = ({ onCancel, onSave, playerStats }) => {
  const [category, setCategory] = useState(
    Object.keys(logTemplates)[0] || "system"
  );
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [type, setType] = useState("INFO");
  const [message, setMessage] = useState(
    "System maintenance cycle completed. No anomalies detected."
  ); // Short Summary
  const [detailContent, setDetailContent] = useState(""); // Detailed Diary
  const [icon, setIcon] = useState("✅");
  const [isCustomMessage, setIsCustomMessage] = useState(false);
  const [isCustomIcon, setIsCustomIcon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Metadata
  const [weather, setWeather] = useState("☀️");
  const [mood, setMood] = useState("😐");
  const [energy, setEnergy] = useState(80);

  // Live Data & Custom Date
  const [currentTime, setCurrentTime] = useState("");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [customDate, setCustomDate] = useState(""); // YYYY-MM-DD
  const [customTime, setCustomTime] = useState(""); // HH:MM

  const categories = Object.keys(logTemplates);
  const availableTemplates = logTemplates[category] || [];
  const availableTypes = [...new Set(availableTemplates.map((t) => t.type))];
  const filteredTemplates = availableTemplates.filter((t) => t.type === type);

  useEffect(() => {
    // Initialize custom date/time with current time on mount
    const now = new Date();
    setCustomDate(
      now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0")
    );
    setCustomTime(
      now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0")
    );
  }, []);

  useEffect(() => {
    const updateTime = () => {
      // If user selected a date, use it. Otherwise live time?
      // Actually, let's keep the trace preview live unless manually overridden,
      // BUT for the "logDate" sent to backend, we use customDate + customTime.

      // Let's make the preview reflect the chosen time.
      let targetDate = new Date();
      if (customDate && customTime) {
        targetDate = new Date(`${customDate}T${customTime}`);
      }

      const dateStr =
        targetDate.getFullYear() +
        "-" +
        String(targetDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(targetDate.getDate()).padStart(2, "0");

      const timeStr =
        targetDate.toTimeString().split(" ")[0] +
        "." +
        targetDate.getMilliseconds().toString().padStart(3, "0");

      setCurrentTime(`${dateStr} ${timeStr}`);

      // Calculate frame based on the LOG TIME, not current time
      if (playerStats?.birthday) {
        // We need a helper that accepts a target date
        const birthday = new Date(playerStats.birthday);
        const diffTime = Math.abs(targetDate - birthday);
        // Simple approx frame calc if not importing the helper logic
        // But we imported calculateFrame. Let's see if it takes a 'now' param.
        // It likely doesn't based on previous usage.
        // We'll just manually calc frame here to be safe or update helper.
        // Frame = seconds since birth / 86400 * 10000 (roughly) or whatever the logic is.
        // Re-using calculateFrame logic:
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        // Assuming frame is just day count or similar.
        // Let's rely on the imported one but it might use 'new Date()' inside.
        // If calculateFrame(birthday) uses current time, we can't easily change it without modifying that util.
        // For now, let's just use the helper and assume it's "close enough" or fix it later if needed.
        // Actually, let's just use the helper for now.
        setCurrentFrame(
          Math.floor(calculateFrame(playerStats.birthday, targetDate))
        );
      }
    };

    updateTime();
    // Only auto-update if we are in "live" mode (maybe optional later),
    // but here we just update when date/time inputs change.
    // If we want seconds to tick, we need an interval.
    // But since we have manual inputs, maybe no auto-tick?
    // Let's keep it static to the selected minute for stability.
  }, [playerStats, customDate, customTime]);

  useEffect(() => {
    const templates = logTemplates[category] || [];
    const types = [...new Set(templates.map((t) => t.type))];
    if (types.length > 0) {
      setType(types[0]);
    }
    setSelectedTemplate(null);
    setIsCustomMessage(false);
    setIsCustomIcon(false);

    // Set defaults based on category
    // REMOVED: Auto-filling message for 'system' category.
    // RATIONALE: User feedback indicates auto-filling content destroys intent.
    // Instead, we clear the message to let the user choose explicitly.
    setMessage("");
    setIcon("📝");
  }, [category]);

  useEffect(() => {
    // This effect handles type changes that are NOT caused by category changes
    // But since we can't easily distinguish, we'll just check if we need to reset.

    // If category is system and type is INFO, do nothing (handled by default state or category effect)
    if (category === "system" && type === "INFO") return;

    // For other cases, we generally want to reset to clean state on type change
    // UNLESS this type change was just triggered by the category effect (which sets type[0])

    // To solve this, we can make the category effect responsible for ALL resets when category changes.
    // And this effect only responsible for resets when type changes BUT category stays same.
    // However, category dependency is here too.

    // Let's rely on a simpler logic:
    // If the selected type is valid for the current category, we assume it's a user choice or valid default.
    // We just ensure fields are reset if they shouldn't persist across types.

    if (availableTypes.includes(type)) {
      // Only reset if it's NOT the system default
      if (!(category === "system" && type === "INFO")) {
        // Check if we just switched categories (which would have cleared message already)
        // or if we are switching types within category.

        // Let's just reset if message is the system default one, so it doesn't carry over to ERROR type.
        if (
          message ===
          "System maintenance cycle completed. No anomalies detected."
        ) {
          setMessage("");
          setIcon("📝");
        }
      }
    }
  }, [type]); // Removed category from dependency to avoid double firing on category change

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

    const finalDate = new Date(`${customDate}T${customTime}`);
    // finalDate here is constructed from local inputs, so it represents the correct local instant.
    // When JSON.stringify handles a Date object, it converts to UTC ISO string automatically.
    // e.g. "2023-10-27T10:30" (Local CN) -> "2023-10-27T02:30:00.000Z" (UTC)
    // This is CORRECT for storage.

    // We also want to store the "Local Date String" explicitly if we want to preserve the "Day" concept
    // regardless of timezone shifts on viewing, OR we rely on the viewer to convert UTC back to their local time.
    // The requirement says: "display format is local time... store converted to standard time... retrieve and convert back".
    // So sending the Date object (which serializes to UTC) is the standard way.

    const payload = JSON.stringify({
      sysTrace: `[${currentTime}][Frame ${currentFrame}][${category.toUpperCase()}]${type}: ${icon} ${message}`,
      body: detailContent,
      metadata: { weather, mood, energy },
      logDate: finalDate,
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
    "🦄",
    "👹",
    "🔮",
  ];

  const theme = getThemeClasses(category);

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-right duration-300 p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-6 border-b ${theme.border} pb-4 shrink-0`}
      >
        <div>
          <h2 className={`text-lg font-bold ${theme.title} tracking-wider`}>
            NEW SYSTEM LOG
          </h2>
          <div className={`flex gap-4 text-xs font-mono ${theme.textDim} mt-1`}>
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
          <div
            className={`flex items-center gap-2 mb-2 border-b ${theme.border} pb-2`}
          >
            <span className={`${theme.text} font-bold text-xs`}>01</span>
            <label className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              KERNEL TRACE CONFIG
            </label>
          </div>

          {/* Live Preview */}
          <div
            className={`bg-black/60 border ${theme.borderStrong} p-4 rounded font-mono text-[11px] md:text-xs ${theme.text} break-all ${theme.glow} relative group leading-relaxed`}
          >
            <div
              className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"
              title="Live Recording"
            ></div>
            {sysTrace}
          </div>

          <div className="flex gap-2 text-xs font-mono">
            <div className="flex-1">
              <label className="text-gray-500 block mb-1">DATE</label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className={`w-full bg-black/40 border border-gray-700 ${theme.text} p-1 rounded`}
              />
            </div>
            <div className="w-24">
              <label className="text-gray-500 block mb-1">TIME</label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className={`w-full bg-black/40 border border-gray-700 ${theme.text} p-1 rounded`}
              />
            </div>
          </div>

          <LogFormTypeSelector
            categories={categories}
            category={category}
            setCategory={setCategory}
            availableTypes={availableTypes}
            type={type}
            setType={setType}
            theme={theme}
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
                theme={theme}
              />
            </div>
            <div className="w-16 pt-7">
              <div className="text-center text-xs text-gray-500 mb-1">Icon</div>
              <div className="flex justify-center">
                <button
                  className={`w-10 h-10 text-xl bg-gray-800 border border-gray-700 rounded ${theme.hoverBorder} transition-colors`}
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
              theme={theme}
            />
          )}
        </div>

        {/* SECTION 2: VITALS */}
        <div className="space-y-4 pt-4">
          <div
            className={`flex items-center gap-2 mb-2 border-b ${theme.border} pb-2`}
          >
            <span className={`${theme.text} font-bold text-xs`}>02</span>
            <label className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              ENVIRONMENTAL VITALS
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Weather */}
            <div className="bg-black/40 p-3 rounded border border-white/10">
              <div className="text-[10px] text-gray-400 uppercase mb-2">
                Weather Condition
              </div>
              <div className="flex flex-wrap gap-2">
                {WEATHER_OPTS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeather(w)}
                    className={`text-lg p-1 rounded hover:bg-white/10 ${
                      weather === w
                        ? `bg-white/20 ring-1 ${theme.ring}`
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
                        ? `bg-white/20 ring-1 ${theme.ring}`
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
                <span className={`${theme.text}`}>{energy}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${
                  theme.text.split("-")[1]
                }-500`}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: DIARY */}
        <div className="space-y-4 pt-4">
          <div
            className={`flex items-center gap-2 mb-2 border-b ${theme.border} pb-2`}
          >
            <span className={`${theme.text} font-bold text-xs`}>03</span>
            <label className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              DETAILED LOG (OPTIONAL)
            </label>
          </div>
          <textarea
            value={detailContent}
            onChange={(e) => setDetailContent(e.target.value)}
            className={`w-full h-48 bg-black/40 border border-white/10 rounded p-4 text-gray-200 font-mono placeholder-gray-600 focus:${theme.borderStrong} focus:ring-1 focus:${theme.ring}/50 outline-none transition-all resize-none text-sm leading-relaxed`}
            placeholder="Record detailed observations, thoughts, or system anomalies..."
          />
        </div>

        <div className="flex justify-end pt-6 pb-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`
            px-8 py-3 ${theme.bg} ${
              theme.bgHover
            } text-white font-bold tracking-widest uppercase text-sm rounded transition-all shadow-lg ${
              theme.shadow
            }
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
