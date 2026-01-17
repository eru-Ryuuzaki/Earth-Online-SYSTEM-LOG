import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { logTemplates } from "../../data/logTemplates";
import { calculateFrame } from "../../utils/logGenerator";
import LogFormTypeSelector from "../LogFormTypeSelector";
import LogFormMessage from "../LogFormMessage";
import LogFormIcon from "../LogFormIcon";
import LogFormPreview from "../LogFormPreview";
import LogFormVitals from "../LogFormVitals";
import { useTranslation } from "react-i18next";
import { useToast } from "../../contexts/ToastContext";
import {
  parseInitialContent,
  getLocalYYYYMMDD,
  parseLocalYMD,
} from "../../utils/logFormUtils";

const SystemLogCreate = ({
  onCancel,
  onSave,
  playerStats,
  initialData = null,
}) => {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const [category, setCategory] = useState(
    initialData?.category || Object.keys(logTemplates)[0] || "system",
  );
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [type, setType] = useState(initialData?.type || "INFO");

  const initialValues = parseInitialContent(initialData);

  const [message, setMessage] = useState(initialValues.msg);
  const [detailContent, setDetailContent] = useState(initialValues.detail);
  const [icon, setIcon] = useState(initialValues.icon);
  const [isCustomMessage, setIsCustomMessage] = useState(!!initialData);
  const [isCustomIcon, setIsCustomIcon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Metadata
  const [weather, setWeather] = useState(initialValues.weather || "☀️");
  const [mood, setMood] = useState(initialValues.mood || "😐");
  const [energy, setEnergy] = useState(initialValues.energy || 80);

  // Live Data & Custom Date
  const [currentTime, setCurrentTime] = useState("");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [customDate, setCustomDate] = useState(initialValues.date || "");
  const [customTime, setCustomTime] = useState(initialValues.time || "");

  const categories = Object.keys(logTemplates);
  const availableTemplates = logTemplates[category] || [];
  const availableTypes = [...new Set(availableTemplates.map((t) => t.type))];
  const filteredTemplates = availableTemplates.filter((t) => t.type === type);

  const handleDateChange = (e) => {
    const newDate = e.target.value;

    if (newDate) {
      const selectedDate = parseLocalYMD(newDate);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if (selectedDate > todayDate) {
        addToast(t("logs.toasts.future_date"), "WARNING");
        return;
      }

      if (playerStats?.birthday) {
        const normalizedBirthday = getLocalYYYYMMDD(playerStats.birthday);
        const birthDate = parseLocalYMD(normalizedBirthday);

        if (selectedDate < birthDate) {
          addToast(t("logs.toasts.birth_date"), "WARNING");
          return;
        }
      }
    }

    setCustomDate(newDate);
  };

  useEffect(() => {
    // Initialize custom date/time with current time on mount if not provided
    if (!initialData) {
      const now = new Date();
      setCustomDate(
        now.getFullYear() +
          "-" +
          String(now.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(now.getDate()).padStart(2, "0"),
      );
      setCustomTime(
        now.getHours().toString().padStart(2, "0") +
          ":" +
          now.getMinutes().toString().padStart(2, "0"),
      );
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
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

      if (playerStats?.birthday) {
        setCurrentFrame(
          Math.floor(calculateFrame(playerStats.birthday, targetDate)),
        );
      }
    };

    updateTime();
  }, [playerStats, customDate, customTime]);

  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialData) return;
    }

    const templates = logTemplates[category] || [];
    const types = [...new Set(templates.map((t) => t.type))];
    if (types.length > 0) {
      setType(types[0]);
    }
    setSelectedTemplate(null);
    setIsCustomMessage(false);
    setIsCustomIcon(false);

    if (category === "system") {
      const defaultMsg = t("log_templates.system.INFO.check", {
        defaultValue:
          "System maintenance cycle completed. No anomalies detected.",
      });
      setMessage(defaultMsg);
      setIcon("✅");
    } else {
      setMessage("");
      setIcon("📝");
    }
  }, [category, t, i18n.language, initialData]);

  useEffect(() => {
    if (category === "system" && type === "INFO") return;

    if (availableTypes.includes(type)) {
      if (!(category === "system" && type === "INFO")) {
        if (
          message ===
          "System maintenance cycle completed. No anomalies detected."
        ) {
          setMessage("");
          setIcon("📝");
        }
      }
    }
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
      const translatedMsg = template.key
        ? t(`log_templates.${category}.${template.type}.${template.key}`, {
            defaultValue: template.msg,
          })
        : t(`log_templates.${category}.${template.type}`, {
            defaultValue: template.msg,
          });
      setMessage(translatedMsg);
      setIcon(template.icon);
      setIsCustomMessage(false);
      setIsCustomIcon(false);
    }
  };

  const handleSubmit = () => {
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const timeStr = customTime || "00:00";
    const finalDate = new Date(`${customDate}T${timeStr}`);

    if (isNaN(finalDate.getTime())) {
      addToast(t("logs.toasts.invalid_date"), "ERROR");
      setIsSubmitting(false);
      return;
    }

    const payload = JSON.stringify({
      sysTrace: `[${currentTime}][Frame ${currentFrame}][${category.toUpperCase()}]${type}: ${icon} ${message}`,
      body: detailContent,
      metadata: { weather, mood, energy, icon },
      logDate: customDate,
      logTime: timeStr,
      fullDate: finalDate,
    });

    setTimeout(() => {
      onSave(payload, type, finalDate, category, {
        weather,
        mood,
        energy,
        icon,
      });
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
    "📊",
    "🔋",
    "🟢",
    "🏆",
    "⏩",
    "📈",
    "👑",
    "📜",
    "💬",
    "✈️",
    "❔",
    "⚔️",
    "🏳️",
    "👀",
    "❤️‍🩹",
    "🌤️",
    "📢",
    "💤",
    "👻",
    "🔮",
    "👁️",
    "🌀",
  ];

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-right duration-300 p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-cyan-500/20 pb-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-cyan-500 tracking-wider">
            {initialData ? "EDIT SYSTEM LOG" : t("logs.new_log")}
          </h2>
          <div className="flex gap-4 text-xs font-mono text-cyan-500/60 mt-1">
            <span>{t("logs.mode")}</span>
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
          <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/30 pb-2">
            <span className="text-cyan-400 font-bold text-xs">01</span>
            <label className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              {t("logs.kernel_trace")}
            </label>
          </div>

          <div className="flex gap-2 text-xs font-mono">
            <div className="flex-1">
              <label className="text-gray-500 block mb-1">DATE</label>
              <input
                type="date"
                value={customDate}
                onChange={handleDateChange}
                className="w-full bg-black/40 border border-gray-700 text-cyan-400 p-1 rounded"
              />
            </div>
            <div className="w-24">
              <label className="text-gray-500 block mb-1">TIME</label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 text-cyan-400 p-1 rounded"
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
                category={category}
              />
            </div>
            <div className="w-16 pt-5">
              <div className="text-center text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-bold">
                Icon
              </div>
              <div className="flex justify-center">
                <button
                  className="w-8 h-8 flex items-center justify-center text-lg bg-black/60 border border-gray-700 rounded hover:border-cyan-500 transition-colors"
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

          <LogFormPreview
            currentTime={currentTime}
            currentFrame={currentFrame}
            category={category}
            type={type}
            icon={icon}
            message={message}
          />
        </div>

        {/* SECTION 2: VITALS */}
        <LogFormVitals
          weather={weather}
          setWeather={setWeather}
          mood={mood}
          setMood={setMood}
          energy={energy}
          setEnergy={setEnergy}
        />

        {/* SECTION 3: DIARY */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/30 pb-2">
            <span className="text-cyan-400 font-bold text-xs">03</span>
            <label className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              {t("logs.detailed_log")}
            </label>
          </div>
          <textarea
            value={detailContent}
            onChange={(e) => setDetailContent(e.target.value)}
            className="w-full h-48 bg-black/40 border border-white/10 rounded p-4 text-gray-200 font-mono placeholder-gray-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all resize-none text-sm leading-relaxed"
            placeholder={t("logs.detail_placeholder")}
          />
        </div>

        <div className="flex justify-end pt-6 pb-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`
            px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-sm rounded transition-all shadow-lg shadow-cyan-900/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isSubmitting ? "animate-pulse" : ""}
            `}
          >
            {isSubmitting
              ? t("logs.uploading")
              : initialData
                ? "UPDATE LOG"
                : t("logs.commit_log")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemLogCreate;
