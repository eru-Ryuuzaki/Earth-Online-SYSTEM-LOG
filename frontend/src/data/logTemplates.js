export const logTemplates = {
  system: [
    // Routine & Maintenance
    {
      type: "INFO",
      icon: "✅",
      msg: "System maintenance cycle completed. No anomalies detected.",
    },
    {
      type: "INFO",
      icon: "📊",
      msg: "Daily data synchronization finished. Integrity: 100%.",
    },
    {
      type: "RECHARGE",
      icon: "🔋",
      msg: "Energy levels critical. Sleep mode required.",
    },

    // Status & Warnings
    { type: "STABLE", icon: "🟢", msg: "System nominal. All systems go." },
    {
      type: "OPTIMIZED",
      icon: "⚡",
      msg: "Performance optimization complete.",
    },
    {
      type: "WARNING",
      icon: "⚠️",
      msg: "Minor system instability detected. Monitoring...",
    },
    {
      type: "ERROR",
      icon: "❌",
      msg: "Critical error. Immediate attention required.",
    },
  ],
  life_event: [
    // Merged Main Quest & Achievement
    { type: "MILESTONE", icon: "🏆", msg: "Major Life Milestone Reached: " },
    { type: "PROGRESS", icon: "⏩", msg: "Significant Life Progression: " },
    { type: "NEW_CHAPTER", icon: "🚀", msg: "New Life Chapter Started: " },
    { type: "ACHIEVEMENT", icon: "🌟", msg: "Personal Achievement Unlocked: " },
    { type: "SKILL_UP", icon: "📈", msg: "Skill Proficiency Increased: " },
    { type: "TITLE", icon: "👑", msg: "New Role/Title Acquired: " },
  ],
  daily_task: [
    // Merged Side Quest & Routine World Events
    { type: "COMPLETE", icon: "✅", msg: "Daily Task Completed: " },
    { type: "NEW_TASK", icon: "📜", msg: "New Responsibility Assigned: " },
    { type: "SOCIAL", icon: "💬", msg: "Social Interaction Logged: " },
    {
      type: "TRANSACTION",
      icon: "💰",
      msg: "Financial Transaction Processed: ",
    },
    { type: "TRAVEL", icon: "✈️", msg: "Zone Transition / Travel Complete: " },
    { type: "OPTIONAL", icon: "❔", msg: "Optional Activity Recorded: " },
  ],
  challenge: [
    // Merged Combat & Struggles
    {
      type: "VICTORY",
      icon: "⚔️",
      msg: "Challenge Overcome. Experience Gained.",
    },
    { type: "SETBACK", icon: "🏳️", msg: "Temporary Setback Encountered." },
    { type: "CONFLICT", icon: "👀", msg: "Interpersonal Conflict Initiated." },
    { type: "OVERLOAD", icon: "🔥", msg: "Mental/Physical Capacity Exceeded." },
    {
      type: "HEALTH",
      icon: "❤️‍🩹",
      msg: "Health Anomaly Detected. Recovery needed.",
    },
  ],
  environment: [
    // Purely Environmental
    { type: "WEATHER", icon: "🌤️", msg: "Significant Weather Change: " },
    { type: "EVENT", icon: "📢", msg: "Public/World Event Observed: " },
  ],
  dream: [
    // Subconscious & Simulation
    {
      type: "FRAGMENT",
      icon: "🧩",
      msg: "Corrupted Memory Fragment Recovered.",
    },
    {
      type: "LUCID",
      icon: "🦄",
      msg: "Lucid Dream Sequence Initiated. Control established.",
    },
    {
      type: "NIGHTMARE",
      icon: "👹",
      msg: "System Intrusion Detected. Nightmare Scenario.",
    },
    {
      type: "DEJA_VU",
      icon: "🌀",
      msg: "Memory Buffer Overflow. Deja Vu experienced.",
    },
    {
      type: "PROPHECY",
      icon: "🔮",
      msg: "Future Timeline Simulation Observed.",
    },
  ],
};
