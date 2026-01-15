import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { logTemplates } from "../data/logTemplates";
import LogFormTypeSelector from "./LogFormTypeSelector";
import LogFormMessage from "./LogFormMessage";
import LogFormIcon from "./LogFormIcon";
import LogFormPreview from "./LogFormPreview";

const LogForm = ({ onSubmit, onCancel }) => {
  const [category, setCategory] = useState("system");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [type, setType] = useState("INFO");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("📝");
  const [isCustomMessage, setIsCustomMessage] = useState(false);
  const [isCustomIcon, setIsCustomIcon] = useState(false);

  const categories = Object.keys(logTemplates);
  const availableTemplates = logTemplates[category] || [];
  const availableTypes = [...new Set(availableTemplates.map((t) => t.type))];
  const filteredTemplates = availableTemplates.filter((t) => t.type === type);

  // Reset when category changes
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

  // Reset template when type changes
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit({ category, type, message, icon });
      setMessage("");
      setSelectedTemplate(null);
    }
  };

  const commonIcons = [
    "📝", "✅", "❌", "⚠️", "💡", "🎯", "🔥", "⚡", "💰", "❤️",
    "🎮", "🌟", "🚀", "💪", "🎉", "😊", "😢", "😡", "🤔", "💀",
  ];

  return (
    <div className="max-w-7xl mx-auto mb-4">
      <div className="bg-black/60 backdrop-blur border border-cyan-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-cyan-400">
            Add Custom Log Entry
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <LogFormPreview
            category={category}
            type={type}
            icon={icon}
            message={message}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg transition-colors"
            >
              Add Log
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogForm;
