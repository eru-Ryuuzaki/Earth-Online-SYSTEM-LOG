import React from "react";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";
import TypewriterLog from "./TypewriterLog";

const LogTimeline = ({
  logs,
  collapsedMonths,
  collapsedYears,
  setCollapsedMonths,
  setCollapsedYears,
  logsEndRef,
}) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const organizeLogsByTimeline = () => {
    const timeline = {};
    logs.forEach((log) => {
      const date = new Date(log.fullDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = log.date;

      if (!timeline[year]) timeline[year] = {};
      if (!timeline[year][month]) timeline[year][month] = {};
      if (!timeline[year][month][day]) timeline[year][month][day] = [];

      timeline[year][month][day].push(log);
    });
    return timeline;
  };

  const timeline = organizeLogsByTimeline();

  const toggleMonth = (year, month) => {
    setCollapsedMonths((prev) => ({
      ...prev,
      [`${year}-${month}`]: !prev[`${year}-${month}`],
    }));
  };

  const toggleYear = (year) => {
    setCollapsedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-black/60 backdrop-blur border border-cyan-500/20 rounded-lg p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/30">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-400">System Event Log</h2>
          <div className="ml-auto text-xs text-gray-500 font-mono">
            Live Feed • {logs.length} entries
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {Object.keys(timeline)
            .sort((a, b) => b - a)
            .map((year) => (
              <div key={year} className="mb-4">
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-cyan-500/10 p-2 rounded mb-2"
                  onClick={() => toggleYear(year)}
                >
                  {collapsedYears[year] ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  <span className="font-bold text-cyan-300 text-lg">
                    📅 {year}
                  </span>
                </div>

                {!collapsedYears[year] &&
                  Object.keys(timeline[year])
                    .sort((a, b) => b - a)
                    .map((month) => (
                      <div key={month} className="ml-6 mb-3">
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:bg-cyan-500/5 p-2 rounded mb-2"
                          onClick={() => toggleMonth(year, month)}
                        >
                          {collapsedMonths[`${year}-${month}`] ? (
                            <ChevronRight className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                          <span className="font-semibold text-cyan-400">
                            {monthNames[month]} {year}
                          </span>
                        </div>

                        {!collapsedMonths[`${year}-${month}`] &&
                          Object.keys(timeline[year][month])
                            .sort((a, b) => new Date(b) - new Date(a))
                            .map((day) => (
                              <div key={day} className="ml-6 mb-4">
                                <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                  {new Date(day).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                                <div className="ml-4 border-l-2 border-cyan-500/20 pl-4 space-y-1">
                                  {timeline[year][month][day].map(
                                    (log, idx) => (
                                      <TypewriterLog
                                        key={log.id}
                                        log={log}
                                        isLatest={
                                          idx ===
                                            timeline[year][month][day].length -
                                              1 &&
                                          day === logs[logs.length - 1]?.date
                                        }
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                      </div>
                    ))}
              </div>
            ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* <style jsx>{` */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

export default LogTimeline;
