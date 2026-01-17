import React from "react";

const LogFormMessage = ({
  filteredTemplates,
  selectedTemplate,
  handleTemplateSelect,
  message,
  setMessage,
  setIsCustomMessage,
}) => {
  return (
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
  );
};

export default LogFormMessage;
