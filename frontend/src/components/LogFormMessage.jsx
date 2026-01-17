import React from "react";
import { useTranslation } from "react-i18next";

const LogFormMessage = ({
  filteredTemplates,
  selectedTemplate,
  handleTemplateSelect,
  message,
  setMessage,
  setIsCustomMessage,
  category,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide">
        3️⃣ Message Template{" "}
        <span className="text-cyan-400 text-xs font-normal opacity-80">(选择或自定义消息)</span>
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
            {template.icon}{" "}
            {template.key
              ? t(`log_templates.${category}.${template.type}.${template.key}`, {
                  defaultValue: template.msg,
                })
              : t(`log_templates.${category}.${template.type}`, {
                  defaultValue: template.msg,
                })}
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
  );
};

export default LogFormMessage;
