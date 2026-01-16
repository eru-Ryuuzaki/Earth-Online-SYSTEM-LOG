import { logTemplates } from "../data/logTemplates";

// 计算Frame数（基于出生日期）
export const calculateFrame = (birthday, targetDate = new Date()) => {
  if (!birthday) return 0;
  const birth = new Date(birthday);
  const diffSeconds = Math.floor((targetDate - birth) / 1000);
  // 假设人生是 60 FPS 的游戏
  return Math.max(0, diffSeconds * 60);
};

// 生成随机日志
export const generateLog = (birthday) => {
  const categories = Object.keys(logTemplates);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const template =
    logTemplates[category][
      Math.floor(Math.random() * logTemplates[category].length)
    ];

  const now = new Date();
  const timestamp =
    now.toTimeString().split(" ")[0] +
    "." +
    now.getMilliseconds().toString().padStart(3, "0");
  const frame = calculateFrame(birthday);
  const day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const level = Math.floor(Math.random() * 50) + 1;

  return {
    id: Date.now() + Math.random(),
    timestamp,
    date: now.toISOString().split("T")[0],
    frame,
    type: template.type,
    category,
    message: template.msg.replace("{day}", day).replace("{level}", level),
    icon: template.icon,
    fullDate: now,
  };
};
