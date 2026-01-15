export const logTemplates = {
  system: [
    { type: "INFO", msg: "System initialization complete", icon: "🌍" },
    {
      type: "SUCCESS",
      msg: "Player consciousness loaded successfully",
      icon: "✓",
    },
    {
      type: "WARNING",
      msg: "Memory fragmentation detected, running optimization...",
      icon: "⚠",
    },
    { type: "ERROR", msg: "Sleep quality below threshold [65%]", icon: "✗" },
    { type: "INFO", msg: "Background processes running normally", icon: "⚙️" },
    {
      type: "WARNING",
      msg: "High CPU usage detected: Overthinking Module at 95%",
      icon: "🔥",
    },
  ],
  checkpoint: [
    {
      type: "INFO",
      msg: "Checkpoint saved: Morning Routine [Day {day}]",
      icon: "💾",
    },
    { type: "INFO", msg: "Daily quest completed: Hydration Check", icon: "✓" },
    { type: "INFO", msg: "You may attempt this encounter again", icon: "🔄" },
    {
      type: "SUCCESS",
      msg: "Weekly milestone reached: 7 days streak",
      icon: "🎯",
    },
    {
      type: "INFO",
      msg: "Progress saved: Current location cached",
      icon: "📍",
    },
  ],
  combat: [
    {
      type: "DAMAGE",
      msg: "Received emotional damage: -15 Mental",
      icon: "💔",
    },
    {
      type: "HEAL",
      msg: "Coffee consumed: +20 Mental, +10 Energy",
      icon: "☕",
    },
    {
      type: "CRITICAL",
      msg: "Critical success! Task completed with excellence",
      icon: "⚡",
    },
    {
      type: "DAMAGE",
      msg: "Stubbed toe: -5 HP, Stunned for 3 seconds",
      icon: "🦶",
    },
    { type: "HEAL", msg: "Good night sleep: +30 HP, +40 Mental", icon: "😴" },
    {
      type: "CRITICAL",
      msg: "Dodged social obligation perfectly!",
      icon: "🎭",
    },
  ],
  economy: [
    { type: "GAIN", msg: "Salary deposited: +8500 Coins", icon: "💰" },
    { type: "LOSS", msg: "Monthly rent deducted: -3000 Coins", icon: "💸" },
    { type: "TRADE", msg: "Food expenses: -150 Coins", icon: "🛒" },
    { type: "GAIN", msg: "Found coins in pocket: +25 Coins", icon: "🎁" },
    { type: "LOSS", msg: "Impulse purchase: -500 Coins", icon: "😅" },
    {
      type: "TRADE",
      msg: "Monthly subscription renewed: -15 Coins",
      icon: "📱",
    },
  ],
  social: [
    {
      type: "EVENT",
      msg: "Random encounter: Friend NPC wants to chat",
      icon: "💬",
    },
    {
      type: "QUEST",
      msg: "New quest available: Family Dinner [Optional]",
      icon: "📋",
    },
    {
      type: "SUCCESS",
      msg: "Relationship improved: +5 Friendship points",
      icon: "❤️",
    },
    { type: "EVENT", msg: "Incoming call from Boss NPC", icon: "📞" },
    { type: "WARNING", msg: "Social battery low: 15% remaining", icon: "🔋" },
    {
      type: "SUCCESS",
      msg: "Small talk mastered: Awkwardness avoided",
      icon: "🎭",
    },
  ],
  status: [
    {
      type: "BUFF",
      msg: "Buff gained: [Well Rested] +20% XP for 4 hours",
      icon: "✨",
    },
    {
      type: "DEBUFF",
      msg: "Debuff applied: [Anxiety] -10% Mental Regen",
      icon: "😰",
    },
    { type: "EXPIRED", msg: "Buff expired: [Motivated]", icon: "⏰" },
    {
      type: "BUFF",
      msg: "Buff gained: [Inspired] +30% Creativity",
      icon: "💡",
    },
    {
      type: "DEBUFF",
      msg: "Debuff applied: [Procrastination] -50% Productivity",
      icon: "🐌",
    },
    {
      type: "BUFF",
      msg: "Buff gained: [Weekend Mode] No work obligations",
      icon: "🎉",
    },
  ],
  achievement: [
    {
      type: "UNLOCK",
      msg: "Achievement unlocked: [Early Bird] Wake up before 6 AM",
      icon: "🏆",
    },
    {
      type: "MILESTONE",
      msg: "Level up! You are now Level {level}",
      icon: "⬆️",
    },
    {
      type: "PROGRESS",
      msg: "Skill improved: [Cooking] Lv.12 → Lv.13",
      icon: "📈",
    },
    {
      type: "UNLOCK",
      msg: "Achievement unlocked: [Survivor] Completed 30 days",
      icon: "🎖️",
    },
    {
      type: "MILESTONE",
      msg: "New title earned: [Experienced Player]",
      icon: "👑",
    },
    {
      type: "PROGRESS",
      msg: "Skill improved: [Patience] Lv.8 → Lv.9",
      icon: "🧘",
    },
  ],
};
