export const getLogDate = (log) => {
  try {
    const content =
      typeof log.content === "string" ? JSON.parse(log.content) : log.content;
    if (content?.logDate) {
      // If it's a YYYY-MM-DD string, construct local date to avoid timezone shift
      if (/^\d{4}-\d{2}-\d{2}$/.test(content.logDate)) {
        const [y, m, d] = content.logDate.split("-").map(Number);
        return new Date(y, m - 1, d);
      }
      return content.logDate;
    }
  } catch (e) {}
  return log.logDate || log.createdAt || log.timestamp;
};

export const parseLogContent = (content) => {
  try {
    if (!content) return null;
    if (typeof content === "object") return content;
    return JSON.parse(content);
  } catch (e) {
    return { body: content };
  }
};

export const parseLogTrace = (trace) => {
  if (!trace) return null;
  // Parse trace: [TIME][Frame X][CAT]TYPE: ICON MSG
  const match = trace.match(/^(\[.*?\])(\[Frame.*?\])(\[.*?\])(.*?):(.*)/);
  if (match) {
    return {
      time: match[1],
      frame: match[2],
      category: match[3],
      type: match[4],
      message: match[5],
    };
  }
  return null;
};

export const getTypeColor = (type) => {
  switch (type) {
    case "NOTE":
      return "text-blue-300 bg-blue-500/20 border-blue-400/30";
    case "TODO":
      return "text-yellow-300 bg-yellow-500/20 border-yellow-400/30";
    case "IDEA":
      return "text-purple-300 bg-purple-500/20 border-purple-400/30";
    case "MEMORY":
      return "text-pink-300 bg-pink-500/20 border-pink-400/30";
    case "OBSERVATION":
      return "text-cyan-300 bg-cyan-500/20 border-cyan-400/30";
    case "INFO":
      return "text-cyan-300 bg-cyan-500/20 border-cyan-400/30";
    case "WARNING":
      return "text-orange-300 bg-orange-500/20 border-orange-400/30";
    case "ERROR":
      return "text-red-300 bg-red-500/20 border-red-400/30";
    case "SUCCESS":
      return "text-green-300 bg-green-500/20 border-green-400/30";
    case "REM_CYCLE":
    case "NIGHTMARE":
    case "LUCID":
    case "VISION":
    case "DEJA_VU":
      return "text-indigo-300 bg-indigo-500/20 border-indigo-400/30";
    default:
      return "text-gray-300 bg-gray-500/20 border-gray-400/30";
  }
};
