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
      <label className="block text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">
        Message Template
      </label>
      <select
        onChange={handleTemplateSelect}
        className="w-full bg-black/60 border border-gray-700 rounded px-2 py-1.5 text-xs text-cyan-100 outline-none focus:border-cyan-500 focus:bg-cyan-950/50 transition-all cursor-pointer mb-2 hover:border-cyan-500"
        value={
          selectedTemplate
            ? filteredTemplates.indexOf(selectedTemplate)
            : "custom"
        }
      >
        <option value="custom">✍️ Custom Message</option>
        {filteredTemplates.map((template, index) => (
          <option key={index} value={index}>
            {template.icon}{" "}
            {template.key
              ? t(
                  `log_templates.${category}.${template.type}.${template.key}`,
                  {
                    defaultValue: template.msg,
                  },
                )
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
        rows={2}
        className="w-full bg-black/60 border border-gray-700 rounded p-2 text-xs text-cyan-100 font-mono resize-none outline-none focus:border-cyan-500 focus:bg-cyan-950/50 transition-all placeholder-gray-600 leading-relaxed"
        placeholder="Enter your log message or select from templates above..."
        required
      />
    </div>
  );
};

export default LogFormMessage;
