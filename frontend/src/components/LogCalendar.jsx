import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

const LogCalendar = ({ logs = [], onLogClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ticker, setTicker] = useState(0);

  // Ticker for rotating icons
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((t) => t + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const extractIcon = (log) => {
    try {
      let content = log.content;

      // Attempt to parse if it's a string
      if (typeof content === "string") {
        try {
          content = JSON.parse(content);
        } catch (e) {
          // If parse fails, it might be a raw string, but our logs usually have JSON structure
          // If it's just a raw string, we can't extract icon from sysTrace structure
          return null;
        }
      }

      // Case 1: sysTrace exists (Rich Log)
      const trace = content?.sysTrace;
      if (trace) {
        // Format: ...TYPE: ICON MSG
        // Regex is safer than split for this format: ...: 📝 Message...
        // Updated Regex to handle more emoji/symbol ranges including ⚙️ (\u2699)
        const match = trace.match(
          /:\s(\p{Emoji_Presentation}|\p{Extended_Pictographic}|[\u2000-\u3300]|[\uD83C\uD000-\uD83D\uDFFF])\s/u
        );
        if (match) {
          return match[1];
        }

        // Fallback split method for cases like "INFO: ⚙️ Message"
        // IMPROVED: Avoid splitting by ":" if it's part of the timestamp.
        // The standard format is `[Timestamp]...[Category]TYPE: Message`
        // We can split by ": " (colon + space) which is more reliable than just ":"
        const parts = trace.split(": ");
        if (parts.length >= 2) {
          // parts[0] is header + type (e.g., "[...]INFO")
          // parts[1] is "⚙️ Background..."
          // But what if message contains ": "?
          // We just take the rest of the string starting from the first ": "
          const firstSeparatorIndex = trace.indexOf(": ");
          if (firstSeparatorIndex !== -1) {
            const msgPart = trace.substring(firstSeparatorIndex + 2).trim();
            const firstChar = Array.from(msgPart)[0];

            if (firstChar && !/^[a-zA-Z0-9\s]$/.test(firstChar)) {
              return firstChar;
            }
          }
        }
      }

      // Case 2: Icon field exists directly (Backward compat or manual raw logs)
      if (content?.icon) return content.icon;

      // Case 3: Fallback based on log type if no icon found
      // You can define a map here if needed

      return null;
    } catch (e) {
      return null;
    }
  };

  const logsByDate = useMemo(() => {
    const map = {};
    logs.forEach((log) => {
      // Prioritize logDate, fallback to createdAt
      let dateStr = log.logDate;
      if (!dateStr) {
        // Check inside content.logDate if it exists (for backward compat if any)
        try {
          const c =
            typeof log.content === "string"
              ? JSON.parse(log.content)
              : log.content;
          if (c.logDate) dateStr = c.logDate;
        } catch (e) {}
      }
      if (!dateStr) dateStr = log.createdAt;

      if (dateStr) {
        let date;
        // Check if dateStr is strictly YYYY-MM-DD (from logDate input) to treat as local
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [y, m, d] = dateStr.split("-").map(Number);
          date = new Date(y, m - 1, d);
        } else {
          // ISO string or other format, let Date parse it (usually handles UTC correctly)
          const parsed = new Date(dateStr);
          // If it's a full ISO string (which logDate often is now, e.g. "2026-01-17T04:47:53.856Z")
          // We should use the local date parts of that timestamp, not the UTC date parts converted to local.
          // Or rather, we need to respect how the user "sees" the date.

          // However, the issue described is "missing log".
          // The user provided log has: "logDate": "2026-01-17T04:47:53.856Z"
          // And "sysTrace": "[2026-01-16 12:03:44.635]..."

          // Wait, the sysTrace says 2026-01-16, but logDate says 2026-01-17.
          // If the user expects it on the 16th (based on trace), but we map by logDate (17th), it might be on the "wrong" day?
          // BUT the user says "missing log", implying it's not showing up at all or showing as '0' (meaning extractIcon failed).
          // "在日历上显示的 icon 不是⚙️ 而是 0" -> This means it IS showing up, but with '0' as the icon.

          // If the icon is '0', it means extractIcon returned '0' or something falsy that rendered as 0?
          // Or maybe the fallback logic is picking up a digit?

          // Let's re-examine extractIcon fallback.
          // msgPart = " ⚙️ Background processes..."
          // firstChar = " " (space) -> Regex check !/^[a-zA-Z0-9\s]$/
          // Space IS matched by \s, so it returns false.
          // So it continues... and returns null?

          // Wait, parts.slice(1).join(":").trim() removes leading space!
          // So msgPart = "⚙️ Background processes..."
          // firstChar = "⚙️"

          // If extractIcon returns null, what happens?
          // if (icon) { map[key].push(...) }
          // So if icon is null, it's NOT added to the map.
          // If it's not added, the day shows "0" (the date number)? No, the date number is rendered separately.
          // Ah, "content" variable in renderDays is initialized to the date number.
          // If dayLogs.length > 0, it is overwritten by the log icon.
          // If the user says "displays 0", maybe they mean it displays the date number (e.g. 16 or 17) instead of the icon?
          // OR, does it display the literal character "0"?

          // If extractIcon returns a digit (e.g. "0"), then it would display "0".
          // Why would it return a digit?
          // trace: "[2026-01-16 12:03:44.635][Frame 49311085440][SYSTEM]INFO: ⚙️ Background..."
          // split(":") ->
          // [0]: "[2026-01-16 12"
          // [1]: "03"
          // [2]: "44.635][Frame 49311085440][SYSTEM]INFO"
          // [3]: " ⚙️ Background..."

          // parts.length is 4.
          // parts.slice(1).join(":") -> "03:44.635][Frame 49311085440][SYSTEM]INFO: ⚙️ Background..."
          // .trim() -> "03:44.635][Frame 49311085440][SYSTEM]INFO: ⚙️ Background..."
          // firstChar = "0"
          // "0" matches /^[a-zA-Z0-9\s]$/ (it is a number).
          // So the fallback returns undefined/null (because if block is skipped).
          // Wait, if fallback returns null, then extractIcon returns null.

          // The issue is simply that `trace.split(":")` is naive because the timestamp contains colons!

          // We need to split by the FIRST occurrence of ": " (colon space) or find the type separator more robustly.
          // Or, better, use the known structure of the log.
          // The standard format seems to be: ...[TYPE]: ICON ... or ...TYPE: ICON ...
          // In the user example: ...[SYSTEM]INFO: ⚙️ ...

          // We should look for the LAST colon before the message? Or the first colon after the brackets?
          // Actually, the log format seems to be: `[Timestamp][Frame][Category]Type: Message`

          // Correct approach: Find the index of "INFO:", "WARN:", "ERROR:", etc., or just the first ": " after the header.
          // Since we can't be sure of the header format, maybe we should just look for the first emoji/icon in the whole string?
          // But that might pick up stuff from the message body.

          // Let's try to match the pattern `]: ` or `]TYPE: ` or just `: ` that separates metadata from content.
          // The `sysTrace` usually ends the metadata block with `: `.

          date = parsed;
        }

        // Normalize to YYYY-MM-DD
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        if (!map[key]) map[key] = [];

        const icon = extractIcon(log);
        if (icon) {
          map[key].push({ ...log, icon });
        }
      }
    });
    return map;
  }, [logs]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    const totalCells = 42; // 6 rows * 7 columns

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-7 md:h-9" />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${month}-${d}`;
      const dayLogs = logsByDate[key] || [];
      const isToday =
        today.getDate() === d &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      let content = (
        <span
          className={`text-[9px] md:text-[10px] font-mono ${
            isToday ? "text-cyan-400 font-bold" : "text-gray-500"
          }`}
        >
          {d}
        </span>
      );

      if (dayLogs.length > 0) {
        const activeLogIndex = ticker % dayLogs.length;
        const activeLog = dayLogs[activeLogIndex];

        content = (
          <div
            className="w-full h-full flex items-center justify-center relative group cursor-pointer"
            onClick={() => onLogClick && onLogClick(activeLog)}
          >
            {/* Date Number Overlay (Top Left) */}
            <span
              className={`absolute top-0.5 left-1 text-[8px] font-mono leading-none ${
                isToday ? "text-cyan-400" : "text-gray-600"
              }`}
            >
              {d}
            </span>

            <span className="text-xs md:text-sm animate-in zoom-in-50 duration-300 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
              {activeLog.icon}
            </span>

            {dayLogs.length > 1 && (
              <div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
                {dayLogs.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 h-0.5 rounded-full ${
                      i === activeLogIndex ? "bg-cyan-400" : "bg-gray-600"
                    }`}
                  ></div>
                ))}
              </div>
            )}

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-max max-w-[200px] bg-gray-900/95 border border-cyan-500/30 p-2 rounded text-[10px] text-gray-200 pointer-events-none whitespace-normal text-center shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="text-cyan-400 font-bold mb-0.5 border-b border-white/10 pb-0.5">
                {new Date(
                  activeLog.createdAt || activeLog.logDate
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="line-clamp-2 text-gray-300">
                {(() => {
                  try {
                    const c =
                      typeof activeLog.content === "string"
                        ? JSON.parse(activeLog.content)
                        : activeLog.content;
                    // Try to get clean message part from trace or body
                    const trace = c.sysTrace || "";
                    const msgMatch = trace.match(
                      /:\s(\p{Emoji}|[\u2000-\u3300])\s(.*)/u
                    );
                    return msgMatch ? msgMatch[2] : c.body || "Log Entry";
                  } catch (e) {
                    return "Log Entry";
                  }
                })()}
              </div>
            </div>
          </div>
        );
      }

      days.push(
        <div
          key={d}
          className={`
            h-7 md:h-9 border border-white/5 flex items-center justify-center relative transition-all duration-300
            ${
              isToday
                ? "bg-cyan-500/5 border-cyan-500/30 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]"
                : "hover:bg-white/5"
            }
            ${
              dayLogs.length > 0
                ? "bg-gradient-to-br from-white/5 to-transparent"
                : ""
            }
          `}
        >
          {content}
        </div>
      );
    }

    // Fill remaining cells to complete 42 cells (6 rows)
    const filledCells = firstDay + daysInMonth;
    const remainingCells = totalCells - filledCells;
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div
          key={`next-empty-${i}`}
          className="h-7 md:h-9 opacity-20 border border-white/5 bg-white/5 pointer-events-none"
        />
      );
    }

    return days;
  };

  const MONTH_NAMES = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  return (
    <div className="bg-black/20 rounded border border-white/5 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-widest">
          <CalendarIcon className="w-4 h-4" />
          <span>
            {MONTH_NAMES[month]} {year}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
          <div
            key={day}
            className="text-center text-[10px] text-gray-500 font-bold"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 flex-1 content-start">
        {renderDays()}
      </div>
    </div>
  );
};

export default LogCalendar;
