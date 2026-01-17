export const getSystemFeedbackKey = (feedback) => {
  // Map backend feedback strings to translation keys
  // This is a simple heuristic mapping. In a real app, backend should return codes.
  if (!feedback) return "";

  // Check for common patterns
  if (feedback.includes("Energy levels critical")) return "energy_critical";
  if (feedback.includes("Data integrity verified")) return "integrity_verified";
  if (feedback.includes("New skill detected")) return "skill_detected";
  if (feedback.includes("Milestone recorded")) return "milestone_recorded";
  if (feedback.includes("Task completion verified")) return "task_verified";
  if (feedback.includes("Combat data analyzed")) return "combat_analyzed";
  if (feedback.includes("Weather adaptation protocol"))
    return "weather_protocol";
  if (feedback.includes("REM cycle data archived")) return "rem_archived";
  if (feedback.includes("Stress levels monitoring")) return "stress_monitoring";

  // --- 1. CATEGORY BASED ---
  // DREAM (now handled by REM cycle mostly, but keeping generic dream feedback)
  if (feedback.includes("Subconscious data stream"))
    return "dream_subconscious";
  if (feedback.includes("REM cycle artifacts")) return "dream_rem_artifacts";
  if (feedback.includes("Abstract logic patterns")) return "dream_abstract";
  if (feedback.includes("Neural pathway mapping")) return "dream_neural";
  if (feedback.includes("Dream sequence archived")) return "dream_sequence";

  // HEALTH
  if (feedback.includes("Biological metrics updated")) return "health_metrics";
  if (feedback.includes("Physical status logged")) return "health_physical";
  if (feedback.includes("Health integrity scan")) return "health_integrity";
  if (feedback.includes("Vital signs correlation")) return "health_vitals";
  if (feedback.includes("Somatic data archived")) return "health_somatic";

  // WORK
  if (feedback.includes("Productivity metrics calculated"))
    return "work_productivity";
  if (feedback.includes("Task execution cycle")) return "work_cycle";
  if (feedback.includes("Output efficiency analyzed")) return "work_efficiency";
  if (feedback.includes("Professional objective tracked"))
    return "work_objective";
  if (feedback.includes("Workload data committed")) return "work_workload";

  // --- 2. TYPE BASED ---
  // ERROR
  if (feedback.includes("Anomaly detected")) return "error_anomaly";
  if (feedback.includes("Error log persisted")) return "error_persisted";
  if (feedback.includes("System integrity warning")) return "error_integrity";
  if (feedback.includes("Exception handling protocol")) return "error_protocol";
  if (feedback.includes("Glitch in the matrix")) return "error_glitch";

  // SUCCESS
  if (feedback.includes("Operation completed successfully"))
    return "success_operation";
  if (feedback.includes("Outcome: POSITIVE")) return "success_outcome";
  if (feedback.includes("Success state locked")) return "success_locked";
  if (feedback.includes("Optimal performance achieved"))
    return "success_optimal";
  if (feedback.includes("Objective verified complete"))
    return "success_objective";

  // WARNING
  if (feedback.includes("Cautionary flag raised")) return "warning_caution";
  if (feedback.includes("Potential instability noted"))
    return "warning_instability";
  if (feedback.includes("Warning threshold approached"))
    return "warning_threshold";
  if (feedback.includes("Alert state: YELLOW")) return "warning_alert";
  if (feedback.includes("Preventive monitoring active"))
    return "warning_preventive";

  // --- 3. WEATHER BASED ---
  // Sunny
  if (feedback.includes("Solar input efficiency")) return "weather_solar";
  if (feedback.includes("Visibility conditions")) return "weather_visibility";
  if (feedback.includes("External temperature nominal"))
    return "weather_temp_nominal";
  if (feedback.includes("Photovoltaic potential"))
    return "weather_photovoltaic";
  if (feedback.includes("Clear sky protocols")) return "weather_clear_sky";

  // Rain/Storm
  if (feedback.includes("External precipitation detected"))
    return "weather_precipitation";
  if (feedback.includes("Atmospheric humidity rising"))
    return "weather_humidity";
  if (feedback.includes("Acoustic rain pattern")) return "weather_rain_pattern";
  if (feedback.includes("Environment: WET")) return "weather_wet";
  if (feedback.includes("Hydro-static pressure alert"))
    return "weather_hydro_pressure";

  // Snow
  if (feedback.includes("Low temperature warning")) return "weather_low_temp";
  if (feedback.includes("Cryogenic conditions external"))
    return "weather_cryogenic";
  if (feedback.includes("Thermal regulation active")) return "weather_thermal";
  if (feedback.includes("Friction coefficient reduced"))
    return "weather_friction";
  if (feedback.includes("Environment: FROZEN")) return "weather_frozen";

  // Dark/Cloudy
  if (feedback.includes("Low light conditions")) return "weather_low_light";
  if (feedback.includes("UV index low")) return "weather_uv_low";
  if (feedback.includes("Night vision recommended"))
    return "weather_night_vision";
  if (feedback.includes("Atmospheric density high")) return "weather_density";
  if (feedback.includes("Shadow operational mode")) return "weather_shadow";

  // --- 4. MOOD BASED ---
  // Happy/Excited
  if (feedback.includes("User morale operating at peak"))
    return "mood_morale_peak";
  if (feedback.includes("Positive emotional state")) return "mood_positive";
  if (feedback.includes("Dopamine receptors active")) return "mood_dopamine";
  if (feedback.includes("Optimal psychological condition"))
    return "mood_optimal";
  if (feedback.includes("Mood metric: EXCELLENT")) return "mood_excellent";

  // Sad
  if (feedback.includes("Serotonin deficiency noted")) return "mood_serotonin";
  if (feedback.includes("Emotional support protocol")) return "mood_support";
  if (feedback.includes("Resilience check required")) return "mood_resilience";
  if (feedback.includes("Empathy module initializing")) return "mood_empathy";
  if (feedback.includes("Psychological dampening detected"))
    return "mood_dampening";

  // Angry
  if (feedback.includes("Cortisol levels elevated")) return "mood_cortisol";
  if (feedback.includes("Aggression dampening recommended"))
    return "mood_aggression";
  if (feedback.includes("Stress threshold exceeded"))
    return "mood_stress_threshold";
  if (feedback.includes("Cooling logic applied")) return "mood_cooling";
  if (feedback.includes("Emotional volatility high")) return "mood_volatility";

  // Thinking/Zen
  if (feedback.includes("Cognitive processing intensified"))
    return "mood_cognitive";
  if (feedback.includes("Neural network training")) return "mood_neural";
  if (feedback.includes("Focus state: DEEP")) return "mood_focus";
  if (feedback.includes("Analytical subroutine running"))
    return "mood_analytical";
  if (feedback.includes("Mental clarity optimization")) return "mood_clarity";

  // Sleepy/Neutral
  if (feedback.includes("Background processes idling")) return "mood_idling";
  if (feedback.includes("Status: STABLE/NEUTRAL")) return "mood_neutral";
  if (feedback.includes("Low variance detected")) return "mood_variance";
  if (feedback.includes("Maintenance mode ready")) return "mood_maintenance";
  if (feedback.includes("Equilibrium established")) return "mood_equilibrium";

  // --- 5. ENERGY BASED ---
  // Low
  if (feedback.includes("Low power warning")) return "energy_low";
  if (feedback.includes("Energy reserves critical"))
    return "energy_critical_reserves"; // distinct from top generic
  if (feedback.includes("System fatigue detected")) return "energy_fatigue";
  if (feedback.includes("Metabolic output reduced")) return "energy_metabolic";
  if (feedback.includes("Suggesting hibernation cycle"))
    return "energy_hibernation";

  // High
  if (feedback.includes("Power output maximum")) return "energy_max";
  if (feedback.includes("Kinetic potential at 100%")) return "energy_kinetic";
  if (feedback.includes("High energy state confirmed")) return "energy_high";
  if (feedback.includes("System overclocking active"))
    return "energy_overclock";
  if (feedback.includes("Ready for heavy processing loads"))
    return "energy_heavy_load";

  // --- FALLBACK POOL ---
  if (feedback.includes("Entry recorded")) return "fallback_recorded";
  if (feedback.includes("Survival confirmed")) return "fallback_survival";
  if (feedback.includes("Emotional fluctuation archived"))
    return "fallback_emotional";
  if (feedback.includes("Timeline extended")) return "fallback_timeline";
  if (feedback.includes("Existence verified")) return "fallback_existence";
  if (feedback.includes("Memory fragment secured")) return "fallback_memory";
  // Data integrity verified is already at top
  if (feedback.includes("Log committed to core memory"))
    return "fallback_committed";
  if (feedback.includes("Chronological marker set")) return "fallback_marker";
  if (feedback.includes("Reality anchor updated")) return "fallback_anchor";

  // Default fallback
  return "unknown_feedback";
};
