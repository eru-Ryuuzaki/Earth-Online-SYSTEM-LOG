export const logTemplates = {
  main_quest: [
    { type: "COMPLETE", icon: "🏆", msg: "Main Quest Completed: " },
    { type: "PROGRESS", icon: "⏩", msg: "Story Progression: " },
    { type: "FAILED", icon: "💀", msg: "Mission Failed. Respawn initialized." },
    { type: "START", icon: "🚀", msg: "New Chapter Started: " },
  ],
  side_quest: [
    { type: "COMPLETE", icon: "✅", msg: "Side Quest Completed: " },
    { type: "NEW", icon: "📜", msg: "New Quest Received: " },
    { type: "OPTIONAL", icon: "❔", msg: "Optional Objective: " },
  ],
  system_status: [
    { type: "STABLE", icon: "🟢", msg: "System nominal. All systems go." },
    { type: "OVERLOAD", icon: "🔥", msg: "Mental capacity exceeded. Cooling down." },
    { type: "RECHARGE", icon: "🔋", msg: "Energy levels critical. Sleep mode required." },
    { type: "OPTIMIZED", icon: "⚡", msg: "Performance optimization complete." },
    { type: "ERROR", icon: "❌", msg: "Unexpected runtime error occurred." },
  ],
  achievement: [
    { type: "UNLOCK", icon: "🌟", msg: "Achievement Unlocked: " },
    { type: "SKILL", icon: "📈", msg: "Skill Level Up: " },
    { type: "TITLE", icon: "👑", msg: "New Title Acquired: " },
  ],
  world_event: [
    { type: "WEATHER", icon: "🌤️", msg: "Environmental Change Detected: " },
    { type: "SOCIAL", icon: "💬", msg: "Social Interaction Logged: " },
    { type: "ECONOMY", icon: "💰", msg: "Significant Transaction: " },
  ]
};
