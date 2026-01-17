import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const SystemConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = "WARNING", // WARNING, DANGER, INFO
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  // Use props if provided, otherwise fallback to translations, otherwise defaults
  const finalTitle = title || t("delete_dialog.title", "CONFIRM ACTION");
  const finalMessage =
    message || t("delete_dialog.message", "Are you sure you want to proceed?");
  const finalConfirmText = confirmText || t("delete_dialog.confirm", "CONFIRM");
  const finalCancelText = cancelText || t("delete_dialog.cancel", "CANCEL");

  const styles = {
    WARNING: {
      border: "border-yellow-500",
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      btn: "bg-yellow-600 hover:bg-yellow-500 text-black",
      shadow: "shadow-yellow-900/20",
    },
    DANGER: {
      border: "border-red-500",
      icon: <Trash2 className="w-6 h-6 text-red-500" />,
      btn: "bg-red-600 hover:bg-red-500 text-white",
      shadow: "shadow-red-900/20",
    },
    INFO: {
      border: "border-cyan-500",
      icon: <AlertTriangle className="w-6 h-6 text-cyan-500" />,
      btn: "bg-cyan-600 hover:bg-cyan-500 text-white",
      shadow: "shadow-cyan-900/20",
    },
  };

  const style = styles[type] || styles.WARNING;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-sm bg-black/90 border ${style.border} rounded-lg p-6 shadow-2xl ${style.shadow} animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
            {style.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-bold tracking-wider ${type === "DANGER" ? "text-red-500" : type === "WARNING" ? "text-yellow-500" : "text-cyan-500"}`}
            >
              {finalTitle}
            </h3>
            <div className="text-xs font-mono text-gray-500 mt-1">
              SYSTEM_INTERRUPT // {type}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors -mt-2 -mr-2 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-gray-300 text-sm leading-relaxed mb-8 font-mono border-l-2 border-white/10 pl-3 ml-1">
          {finalMessage}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-bold tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-colors uppercase"
          >
            {finalCancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2 rounded text-xs font-bold tracking-widest uppercase shadow-lg transition-all ${style.btn}`}
          >
            {finalConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemConfirmDialog;
