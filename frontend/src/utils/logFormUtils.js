export const parseInitialContent = (initialData) => {
  if (!initialData) return { msg: "", detail: "", icon: "✅" };
  try {
    const c =
      typeof initialData.content === "string"
        ? JSON.parse(initialData.content)
        : initialData.content;

    // Let's try to extract from sysTrace if possible
    let msg = "";
    let icon = "✅";
    if (c.sysTrace) {
      const parts = c.sysTrace.split(": ");
      if (parts.length > 1) {
        const contentPart = parts.slice(1).join(": "); // "ICON Message"
        // Assume first char is icon (emoji)
        // Simple split by space
        const firstSpace = contentPart.indexOf(" ");
        if (firstSpace > 0) {
          icon = contentPart.substring(0, firstSpace);
          msg = contentPart.substring(firstSpace + 1);
        } else {
          msg = contentPart;
        }
      }
    }

    return {
      msg: msg,
      detail: c.body || "",
      icon: c.metadata?.icon || initialData.icon || icon, // Prefer metadata icon
      weather: c.metadata?.weather || initialData.weather || "☀️",
      mood: c.metadata?.mood || initialData.mood || "😐",
      energy: c.metadata?.energy || initialData.energy || 80,
      date: c.logDate || initialData.logDate,
      time: c.logTime || "",
    };
  } catch (e) {
    return { msg: "", detail: "", icon: "✅" };
  }
};

export const getLocalYYYYMMDD = (dateInput) => {
  if (!dateInput) return "";
  // If it's already a YYYY-MM-DD string, return it to avoid timezone shifting
  if (
    typeof dateInput === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateInput)
  ) {
    return dateInput;
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  // Use local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseLocalYMD = (ymdStr) => {
  if (!ymdStr) return null;
  if (typeof ymdStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(ymdStr)) {
    const [y, m, d] = ymdStr.split("-").map(Number);
    return new Date(y, m - 1, d); // Local Midnight
  }
  // Fallback for Date objects or ISO strings
  const d = new Date(ymdStr);
  d.setHours(0, 0, 0, 0);
  return d;
};
