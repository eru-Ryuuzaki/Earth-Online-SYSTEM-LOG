import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { logTemplates } from "../data/logTemplates";

const LogForm = ({ onSubmit, onCancel }) => {
  const [category, setCategory] = useState("system");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [type, setType] = useState("INFO");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("📝");
  const [isCustomMessage, setIsCustomMessage] = useState(false);
  const [isCustomIcon, setIsCustomIcon] = useState(false);

  const categories = Object.keys(logTemplates);

  // 根据选中的category获取可用的模板
  const availableTemplates = logTemplates[category] || [];

  // 获取当前category下所有可用的type
  const availableTypes = [...new Set(availableTemplates.map((t) => t.type))];

  // 根据选中的type筛选模板
  const filteredTemplates = availableTemplates.filter((t) => t.type === type);

  // 当category改变时，重置选择
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

  // 当type改变时，重置模板选择
  useEffect(() => {
    setSelectedTemplate(null);
    setIsCustomMessage(false);
    setIsCustomIcon(false);
    setMessage("");
    setIcon("📝");
  }, [type]);

  // 当选择模板时，自动填充message和icon
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

  // 常用图标列表
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
          {/* 第一行：Category 和 Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                1️⃣ Category <span className="text-cyan-400">(选择类别)</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white hover:border-cyan-500 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                2️⃣ Type <span className="text-cyan-400">(选择等级)</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white hover:border-cyan-500 transition-colors"
              >
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 第二行：Message 模板选择 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              3️⃣ Message Template{" "}
              <span className="text-cyan-400">(选择或自定义消息)</span>
            </label>
            <select
              onChange={handleTemplateSelect}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white hover:border-cyan-500 transition-colors mb-2"
              value={
                selectedTemplate
                  ? filteredTemplates.indexOf(selectedTemplate)
                  : "custom"
              }
            >
              <option value="custom">✍️ Custom Message (自定义消息)</option>
              {filteredTemplates.map((template, index) => (
                <option key={index} value={index}>
                  {template.icon} {template.msg}
                </option>
              ))}
            </select>

            {/* Message 输入框 */}
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setIsCustomMessage(true);
              }}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white resize-none hover:border-cyan-500 transition-colors"
              placeholder="Enter your log message or select from templates above..."
              required
            />
          </div>

          {/* 第三行：Icon 选择 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              4️⃣ Icon <span className="text-cyan-400">(选择或自定义图标)</span>
            </label>

            {/* 快速选择常用图标 */}
            <div className="flex flex-wrap gap-2 mb-2">
              {commonIcons.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setIcon(emoji);
                    setIsCustomIcon(true);
                  }}
                  className={`w-10 h-10 flex items-center justify-center text-xl rounded border transition-all ${
                    icon === emoji
                      ? "border-cyan-500 bg-cyan-500/20 scale-110"
                      : "border-gray-700 bg-gray-800 hover:border-cyan-500 hover:scale-105"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* 自定义图标输入 */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={icon}
                onChange={(e) => {
                  setIcon(e.target.value);
                  setIsCustomIcon(true);
                }}
                maxLength={2}
                className="w-20 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-center text-xl hover:border-cyan-500 transition-colors"
                placeholder="📝"
              />
              <span className="text-sm text-gray-500">或输入自定义 Emoji</span>
            </div>
          </div>

          {/* 预览 */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-2">Preview:</div>
            <div className="font-mono text-sm flex items-start gap-2">
              <span className="text-gray-500">[HH:MM:SS.mmm]</span>
              <span className="text-gray-600">[Frame XXXXXXXXXX]</span>
              <span className="text-gray-500">[{category}]</span>
              <span
                className={`font-bold ${
                  type === "INFO"
                    ? "text-cyan-400"
                    : type === "SUCCESS"
                    ? "text-green-400"
                    : type === "WARNING"
                    ? "text-yellow-400"
                    : type === "ERROR"
                    ? "text-red-400"
                    : type === "DAMAGE"
                    ? "text-red-500"
                    : type === "HEAL"
                    ? "text-green-500"
                    : type === "CRITICAL"
                    ? "text-purple-400"
                    : type === "GAIN"
                    ? "text-yellow-300"
                    : type === "LOSS"
                    ? "text-orange-400"
                    : "text-cyan-400"
                }`}
              >
                {type}:
              </span>
              <span className="text-gray-300 flex-1">
                {icon} {message || "Your message will appear here..."}
              </span>
            </div>
          </div>

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
