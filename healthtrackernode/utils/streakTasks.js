const TASKS = [
  // -------- EASY (1–10) --------
  { level: "Easy", text: "Walk 8,000 steps" },
  { level: "Easy", text: "Do 50 squats" },
  { level: "Easy", text: "Do 50 push-ups" },
  { level: "Easy", text: "Stretch for 20 minutes" },
  { level: "Easy", text: "Hold plank for 2 Minutes" },
  { level: "Easy", text: "Take a 30-minute walk Continously" },
  { level: "Easy", text: "Do 50 jumping jacks" },
  { level: "Easy", text: "Do 50 lunges" },
  { level: "Easy", text: "Do skipping or jumping 50 times" },
  { level: "Easy", text: "Do 50 mountain climbers" },

  // -------- MEDIUM (11–20) --------
  { level: "Medium", text: "Do 80 push-ups" },
  { level: "Medium", text: "Jog for 30 minutes" },
  { level: "Medium", text: "Hold plank for 2 Minutes" },
  { level: "Medium", text: "Climb 12 floors (stairs)" },
  { level: "Medium", text: "Do 80 squats" },
  { level: "Medium", text: "Stretch or mobility workout for 30 minutes" },
  { level: "Medium", text: "Walk 10,000 steps" },
  { level: "Medium", text: "Do 80 lunges" },
  { level: "Medium", text: "Do 80 jumping jacks" },
  { level: "Medium", text: "Jog continuously for 30 minutes" },

  // -------- HARD (21–30) --------
  { level: "Hard", text: "Do 100 push-ups" },
  { level: "Hard", text: "Run for 30 minutes" },
  { level: "Hard", text: "Hold plank for 3 minutes(break allowed)" },

  { level: "Hard", text: "Do 100 squats" },          // 🔒 KEPT SAME
  { level: "Hard", text: "Walk 12,000 steps" },      // 🔒 KEPT SAME

  { level: "Hard", text: "HIIT workout for 50 minutes" },
  { level: "Hard", text: "Do 80 burpees (any sets)" },
  { level: "Hard", text: "Do 100 lunges (each leg counts)" },
  { level: "Hard", text: "Stretch + yoga for 45 minutes" },
  { level: "Hard", text: "Full-body workout for 60 minutes" }
];

function getTaskForDay(dayIndex) {
  const index = dayIndex % TASKS.length;
  return TASKS[index];
}

module.exports = { getTaskForDay };
