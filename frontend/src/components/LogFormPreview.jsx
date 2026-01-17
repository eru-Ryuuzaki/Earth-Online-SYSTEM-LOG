import React from "react";
import { useTranslation } from "react-i18next";

const LogFormPreview = ({
  currentTime,
  currentFrame,
  category,
  type,
  icon,
  message,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black/60 border border-cyan-500/40 p-4 rounded font-mono text-[11px] md:text-xs text-cyan-300 break-all shadow-[0_0_20px_rgba(6,182,212,0.15)] relative group leading-relaxed">
      <div
        className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"
        title="Live Recording"
      ></div>
      [{currentTime}][Frame {currentFrame}][
      {t(`categories.${category}`).toUpperCase()}]{t(`types.${type}`)}: {icon}{" "}
      {message || "..."}
    </div>
  );
};

export default LogFormPreview;
