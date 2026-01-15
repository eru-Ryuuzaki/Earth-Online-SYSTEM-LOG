import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { logTemplates } from "../../data/logTemplates";
import LogFormTypeSelector from "../LogFormTypeSelector";
import LogFormMessage from "../LogFormMessage";
import LogFormIcon from "../LogFormIcon";
import LogFormPreview from "../LogFormPreview";

const SystemLogCreate = ({ onNavigate, onSave }) => {
  const [category, setCategory] = useState("system");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [type, setType] = useState("INFO");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("📝");
  const [isCustomMessage, setIsCustomMessage] = useState(false);
  const [isCustomIcon, setIsCustomIcon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = Object.keys(logTemplates);
  const availableTemplates = logTemplates[category] || [];
  const availableTypes = [...new Set(availableTemplates.map((t) => t.type))];
  const filteredTemplates = availableTemplates.filter((t) => t.type === type);

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

  const handleSubmit = () => {
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Construct format: [EarthOL][CATEGORY] TYPE: ICON Message
    const formattedContent = `[EarthOL][${category.toUpperCase()}] ${type}: ${icon} ${message}`;

    setTimeout(() => {
      onSave(formattedContent, type);
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
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="text-xl font-bold text-cyan-500 tracking-wider">
            SYSTEM LOG ENTRY CREATOR
          </h2>
          <div className="flex gap-4 text-xs font-mono text-cyan-500/60 mt-1">
            <span>Status: ACTIVE</span>
            <span>Mode: STRUCTURED INPUT</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate("HOME")}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6 bg-black/20 p-6 rounded-xl border border-white/5">
        <LogFormTypeSelector
          categories={categories}
          category={category}
          setCategory={setCategory}
          availableTypes={availableTypes}
          type={type}
          setType={setType}
        />

        <LogFormMessage
          filteredTemplates={filteredTemplates}
          selectedTemplate={selectedTemplate}
          handleTemplateSelect={handleTemplateSelect}
          message={message}
          setMessage={setMessage}
          setIsCustomMessage={setIsCustomMessage}
        />

        <LogFormIcon
          icon={icon}
          setIcon={setIcon}
          setIsCustomIcon={setIsCustomIcon}
          commonIcons={commonIcons}
        />

        <div className="mt-8">
          <label className="block text-sm text-gray-400 mb-2">
            4️⃣ Preview Output
          </label>
          <LogFormPreview
            category={category}
            type={type}
            icon={icon}
            message={message}
          />
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isSubmitting}
            className={`
                px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-sm rounded transition-all shadow-lg shadow-cyan-900/20
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isSubmitting ? "animate-pulse" : ""}
                `}
          >
            {isSubmitting ? "COMMIT LOG ENTRY" : "COMMIT LOG ENTRY"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemLogCreate;
